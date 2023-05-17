/**
 * This model allows getting/putting session data from/to an HTTP request. Every session has an ID and contains
 * app-specific data related to the session. The model uses an interface `Fl32_Auth_Back_Api_Mole` to load data
 * for the current session by its ID and stores this data internally (in the HTTP request or internal cache).
 */
// MODULE'S VARS

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Session {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Auth_Back_Defaults} */
        const DEF = spec['Fl32_Auth_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Session} */
        const rdbSess = spec['Fl32_Auth_Back_RDb_Schema_Session$'];
        /** @type {Fl32_Auth_Back_Api_Mole} */
        const moleApp = spec['Fl32_Auth_Back_Api_Mole$'];
        /** @type {Fl32_Auth_Back_Act_Session_Create.act|function} */
        const actSessCreate = spec['Fl32_Auth_Back_Act_Session_Create$'];
        /** @type {Fl32_Auth_Back_Act_Session_Plant.act|function} */
        const actSessPlant = spec['Fl32_Auth_Back_Act_Session_Plant$'];
        /** @type {Fl32_Auth_Back_Act_Session_Clear.act|function} */
        const actSessClear = spec['Fl32_Auth_Back_Act_Session_Clear$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        /**
         * Internal cache to map session data by session ID.
         * @type {Object<string, Object>}
         */
        const _cache = {};

        // INSTANCE METHODS

        /**
         * Clear session data related to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<boolean>}
         */
        this.close = async function ({request, response, trx}) {
            let res = false;
            const sessionId = request[DEF.REQ_HTTP_SESS_ID];
            if (sessionId) {
                await crud.deleteOne(trx, rdbSess, sessionId);
                delete _cache[sessionId];
                delete request[DEF.REQ_HTTP_SESS_ID];
                actSessClear({request, response});
                logger.info(`Session '${sessionId}' is closed.`);
                res = true;
            }
            return res;
        };

        /**
         * Establish new session for given user:
         *   - generate unique ID for new session;
         *   - plant session ID cookie into HTTP response;
         *   - load session data from DB with mole's implementation;
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid backend ID for related user
         * @returns {Promise<{sessionId: string, sessionData: Object}>}
         */
        this.establish = async function ({request, response, trx, userBid}) {
            const {code: sessionId} = await actSessCreate({trx, userBid});
            actSessPlant({request, response, sessionId});
            const sessionData = await moleApp.sessionDataRead({trx, userBid});
            request[DEF.REQ_HTTP_SESS_ID] = sessionId;
            _cache[sessionId] = sessionData;
            return {sessionId, sessionData};
        };

        /**
         * Get cached session data related to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @returns {*} session data
         */
        this.getCachedData = function ({request}) {
            const sessionId = this.getId(request);
            if (sessionId && _cache[sessionId]) return _cache[sessionId];
            else return null;
        };

        /**
         * Get session ID from an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @returns {string} sessionId
         */
        this.getId = function (request) {
            return request[DEF.REQ_HTTP_SESS_ID];
        };

        /**
         * Save session ID to an HTTP request and load session data from RDb to internal cache.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {string} sessionId
         * @returns {Promise<void>}
         */
        this.putId = async function ({request, sessionId}) {
            if (_cache[sessionId]) {
                // just put sessionId to request if session data was loaded before
                request[DEF.REQ_HTTP_SESS_ID] = sessionId;
            } else {
                // validate session existence and load session data
                const trx = await conn.startTransaction();
                try {
                    /** @type {Fl32_Auth_Back_RDb_Schema_Session.Dto} */
                    const sessRec = await crud.readOne(trx, rdbSess, sessionId);
                    const {sessionData} = await moleApp.sessionDataRead({trx, userBid: sessRec.user_ref});
                    _cache[sessionId] = sessionData;
                    await trx.commit();
                    request[DEF.REQ_HTTP_SESS_ID] = sessionId;
                    logger.info(`Session data is cached for session #${sessionId}.`);
                } catch (error) {
                    logger.error(error);
                    await trx.rollback();
                }
            }
        };

    }
}

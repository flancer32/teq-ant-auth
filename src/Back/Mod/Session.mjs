/**
 * This model allows getting/putting session data from/to an HTTP request. Every session has an ID and contains
 * app-specific data related to the session. The model uses an interface `Fl32_Auth_Back_Api_Mod_User` to load data
 * for the current session by its ID and stores this data internally (in the HTTP request or internal cache).
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Session {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Session} rdbSess
     * @param {Fl32_Auth_Back_Api_Mod_User} modUser
     * @param {Fl32_Auth_Back_Mod_Cookie} modCookie
     * @param {Fl32_Auth_Back_Act_Session_Register} actSessReg
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Session$: rdbSess,
            Fl32_Auth_Back_Api_Mod_User$: modUser,
            Fl32_Auth_Back_Mod_Cookie$: modCookie,
            Fl32_Auth_Back_Act_Session_Register$: actSessReg,
        }
    ) {
        // VARS
        const A_SESS = rdbSess.getAttributes();
        /**
         * Internal cache to map session data by session ID.
         * @type {Object<string, *>}
         */
        const _cache = {};

        // INSTANCE METHODS

        /**
         * Clear session data related to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @return {Promise<{closed: boolean, notFound: boolean}>}
         */
        this.close = async function ({request, response, trx}) {
            let closed = false;
            let notFound = false;
            const sessionId = request[DEF.REQ_HTTP_SESSION_USER_ID];
            if (sessionId) {
                await crud.deleteOne(trx, rdbSess, {[A_SESS.CODE]: sessionId});
                delete _cache[sessionId];
                delete request[DEF.REQ_HTTP_SESSION_USER_ID];
                modCookie.clear({request, response});
                logger.info(`Session '${sessionId}' is closed.`);
                closed = true;
            } else {
                notFound = true;
            }
            return {closed, notFound};
        };

        /**
         * Establish new session for given user:
         *   - remove existing session for given user/front;
         *   - generate unique ID for new session;
         *   - plant session ID cookie into HTTP response;
         *   - load session data from DB with mole's implementation;
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid backend ID for related user
         * @param {number} [frontBid]
         * @param {string} [frontUuid]
         * @param {string} frontKeyEncrypt
         * @param {string} frontKeyVerify
         * @returns {Promise<{sessionId: string, sessionWord:string, sessionData: Object, userUuid:string}>}
         */
        this.establish = async function (
            {
                request,
                response,
                trx,
                userBid,
                frontBid,
                frontUuid,
                frontKeyEncrypt,
                frontKeyVerify,
            }
        ) {
            const {code: sessionId, word: sessionWord, userUuid} = await actSessReg.act({
                trx,
                userBid,
                frontBid,
                frontUuid,
                frontKeyEncrypt,
                frontKeyVerify
            });
            modCookie.plant({request, response, sessionId});
            /** @type {{profileFront: Object}} */
            const {profileBack, profileFront} = await modUser.readProfiles({trx, userBid});
            request[DEF.REQ_HTTP_SESSION_USER_ID] = sessionId;
            _cache[sessionId] = profileBack;
            logger.info(`The new session is established for user #${userUuid}.`);
            return {sessionId, sessionWord, sessionData: profileFront, userUuid};
        };

        /**
         * Get cached session data related to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @returns {*} session data
         */
        this.getCachedData = function ({request}) {
            const sessionId = this.getId({request});
            if (sessionId && _cache[sessionId]) return _cache[sessionId];
            else return null;
        };

        /**
         * Get session ID from an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @returns {string} sessionId
         */
        this.getId = function ({request}) {
            return request[DEF.REQ_HTTP_SESSION_USER_ID];
        };

        /**
         * Save the user session ID to the HTTP request and load session data from RDb to internal cache.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {string} sessionId
         * @returns {Promise<void>}
         */
        this.putId = async function ({request, sessionId}) {
            if (_cache[sessionId]) {
                // just put sessionId to request if session data was loaded before
                request[DEF.REQ_HTTP_SESSION_USER_ID] = sessionId;
            } else {
                // validate session existence and load session data
                const trx = await conn.startTransaction();
                try {
                    const where = {[A_SESS.CODE]: sessionId};
                    /** @type {Fl32_Auth_Back_Store_RDb_Schema_Session.Dto} */
                    const found = await crud.readOne(trx, rdbSess, where);
                    if (found?.user_ref) {
                        const {profileBack} = await modUser.readProfiles({trx, userBid: found.user_ref});
                        _cache[sessionId] = profileBack;
                        await trx.commit();
                        request[DEF.REQ_HTTP_SESSION_USER_ID] = sessionId;
                        logger.info(`Session data is cached for session #${sessionId}.`);
                    }
                } catch (error) {
                    logger.error(error);
                    await trx.rollback();
                }
            }
        };

    }
}
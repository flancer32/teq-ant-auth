/**
 * Default implementation for session data loader.
 */

// MODULE'S VARS

// MODULE'S CLASSES
/**
 * @implements Fl32_Auth_Back_Api_Session_Data
 */
export default class Fl32_Auth_Back_Mod_Session_Data {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Session} */
        const rdbSess = spec['Fl32_Auth_Back_RDb_Schema_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        /** @type {Object<string, Fl32_Auth_Back_RDb_Schema_Session.Dto>} */
        const _cache = {};

        // INSTANCE METHODS

        this.clear = (sessionId) => _cache[sessionId] = undefined;

        /**
         * @inheritDoc
         * @param {string} sessionId
         * @returns {Fl32_Auth_Back_RDb_Schema_Session.Dto}
         */
        this.get = (sessionId) => _cache[sessionId];

        /**
         * @inheritDoc
         * @param {string} sessionId
         * @returns {Promise<Fl32_Auth_Back_RDb_Schema_Session.Dto>}
         */
        this.load = async function (sessionId) {
            if (_cache[sessionId]) {
                // return data from the cache
                return _cache[sessionId];
            } else {
                if (sessionId) {
                    const trx = await conn.startTransaction();
                    try {
                        /** @type {Fl32_Auth_Back_RDb_Schema_Session.Dto} */
                        const sessRec = await crud.readOne(trx, rdbSess, sessionId);
                        await trx.commit();
                        _cache[sessionId] = sessRec;
                        return sessRec;
                    } catch (error) {
                        logger.error(error);
                        await trx.rollback();
                    }
                }
            }
        };


    }
}

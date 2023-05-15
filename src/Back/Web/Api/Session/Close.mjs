/**
 * Close the session for the current user.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Session_Close {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Shared_Web_Api_Session_Close} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Session_Close$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Session_Close.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Session_Close.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                res.success = await modSess.close({trx, request: context.request, response: context.response});
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

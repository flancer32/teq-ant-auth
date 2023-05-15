/**
 * Password base authentication:
 *  - Load user data identified by app specific ID (email, id, uuid, ...) with the mole implementation.
 *  - Validate password hash.
 *  - Establish new session for authenticated user.
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Password_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Shared_Web_Api_Password_Validate} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Password_Validate$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Auth_Back_Mod_Password} */
        const modPass = spec['Fl32_Auth_Back_Mod_Password$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Validate.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Password_Validate.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const hashHex = req.passwordHash;
                const userRef = req.userRef;
                // load user data and validate password's hash
                const {success, userBid} = await modPass.validateHash({trx, userRef, hashHex});
                if (success) {
                    const {sessionData} = await modSess.establish({
                        trx,
                        userBid,
                        request: context.request,
                        response: context.response
                    });
                    if (sessionData) {
                        res.success = true;
                        res.sessionData = sessionData;
                    }
                }
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}

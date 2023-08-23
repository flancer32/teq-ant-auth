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
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Password_Validate} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_Password} modPass
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Password_Validate$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_Password$: modPass,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }) {
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
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}

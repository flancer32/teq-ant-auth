/**
 * Password base authentication:
 *  - Load user data identified by app specific ID (email, id, uuid, ...) with the API implementation.
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
        }
    ) {
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
            const rs = endpoint.createRes();
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const frontUuid = req.frontUuid;
                const frontKeyEncrypt = req.frontKeyEncrypt;
                const frontKeyVerify = req.frontKeyVerify;
                const hash = req.passwordHash;
                const userRef = req.userRef;
                // load user data and validate password's hash
                const {success, dbPass} = await modPass.validateHash({trx, userRef, hash});
                if (success) {
                    const {sessionId, sessionWord, sessionData} = await modSess.establish({
                        trx,
                        userBid: dbPass.user_ref,
                        frontUuid,
                        frontKeyEncrypt,
                        frontKeyVerify,
                        request: context.request,
                        response: context.response
                    });
                    if (sessionId) {
                        rs.sessionData = sessionData;
                        rs.sessionWord = sessionWord;
                        rs.success = true;
                    }
                }
                await trx.commit();
                Object.assign(res, rs); // compose the response after the commit
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}

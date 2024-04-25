/**
 * Replace the current password with a new one.
 *
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Password_Reset_Replace {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_Password} modPass
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     * @param {Fl32_Auth_Back_Act_User_Read} actRead
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl32_Auth_Shared_Web_Api_Password_Reset_Replace$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_Password$: modPass,
            Fl32_Auth_Back_Mod_Session$: modSess,
            Fl32_Auth_Back_Act_User_Read$: actRead,
        }
    ) {
        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const rs = endpoint.createRes();
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const code = req.code;
                const found = await modPass.resetRead({trx, code});
                if (found?.user_ref) {
                    const now = new Date();
                    const created = cast.date(found.date_created);
                    const delta = (now.getTime() - created.getTime());
                    if (delta < DEF.RESET_CODE_LIFETIME) {
                        // save the password and user data then initialize the session
                        const hash = req.passwordHash;
                        const salt = req.passwordSalt;
                        await modPass.update({trx, userBid: found.user_ref, hash, salt});
                        const {sessionWord, sessionData, userUuid} = await modSess.establish({
                            request: context.request,
                            response: context.response,
                            trx,
                            userBid: found.user_ref,
                            frontUuid: req.frontUuid,
                            frontKeyEncrypt: req.frontKeyEncrypt,
                            frontKeyVerify: req.frontKeyVerify,
                        });
                        if (sessionWord) {
                            await modPass.resetDelete({trx, code});
                            rs.sessionData = sessionData;
                            rs.sessionWord = sessionWord;
                            rs.userUuid = userUuid;
                            logger.info(`The password was replaced for the code '${code}' and new session was established.`);
                        }
                    } else {
                        logger.info(`The password reset code '${code}' is expired.`);
                        await modPass.resetDelete({trx, code});
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

/**
 * Load the data to reset the user's password.
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Password_Reset_Check {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Check} endpoint
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
            Fl32_Auth_Shared_Web_Api_Password_Reset_Check$: endpoint,
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
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Response|Object} res
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
                    // check the lifetime
                    const now = new Date();
                    const created = cast.date(found.date_created);
                    const delta = (now.getTime() - created.getTime());
                    if (delta < DEF.RESET_CODE_LIFETIME) {
                        const {dbPass} = await actRead.act({trx, bid: found.user_ref, withPass: true});
                        rs.email = dbPass?.email;
                        rs.success = true;
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

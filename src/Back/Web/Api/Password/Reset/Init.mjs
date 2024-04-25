/**
 * Generate and email the link to reset the user's password if the given email exists.
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Password_Reset_Init {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Init} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_Password} modPass
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Password_Reset_Init$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_Password$: modPass,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }
    ) {
        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const rs = endpoint.createRes();
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const email = req.email;
                const found = await modPass.listByEmail({trx, email});
                const [first] = found;
                if (first) {
                    const dto = await modPass.resetCreate({trx, userBid: first.user_ref});

                    rs.success = true;
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

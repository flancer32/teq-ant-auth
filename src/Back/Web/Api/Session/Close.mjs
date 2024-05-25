/**
 * Close the session for the current user.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Session_Close {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Session_Close} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Session_Close$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }
    ) {
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
                const {closed, notFound} = await modSess.close({
                    trx,
                    request: context.request,
                    response: context.response
                });
                await trx.commit();
                res.success = (closed || notFound);
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

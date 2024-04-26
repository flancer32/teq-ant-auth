/**
 * Get password salt by user identifier (app specific: email, id, uuid, ...).
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Password_Salt_Read {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_Password} modPass
     * @param {Fl32_Auth_Back_Api_Mod_User} modUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Password_Salt_Read$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_Password$: modPass,
            Fl32_Auth_Back_Api_Mod_User$: modUser,
        }
    ) {
        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                const userRef = req.userRef;
                const {bid: userBid} = await modUser.read({trx, userRef});
                const {b64url} = await modPass.readSalt({trx, userBid});
                await trx.commit();
                res.salt = b64url;
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

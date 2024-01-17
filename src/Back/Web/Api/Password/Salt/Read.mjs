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
     * @param {TeqFw_Core_Shared_Util_Codec.binToHex|function} binToHex
     * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
     * @param {Fl32_Auth_Back_Api_Mole} moleUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Core_Shared_Util_Codec.binToHex': binToHex,
            Fl32_Auth_Shared_Web_Api_Password_Salt_Read$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
            Fl32_Auth_Back_Api_Mole$: moleUser,
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
            // FUNCS
            async function readPasswordSalt(trx, userBid) {
                /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
                const found = await crud.readOne(trx, rdbPass, userBid);
                return (found?.salt) ? binToHex(found.salt) : null;
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const userRef = req.userRef;
                //
                const {userBid} = await moleUser.userRead({trx, userRef});
                res.salt = await readPasswordSalt(trx, userBid);
                await trx.commit();
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

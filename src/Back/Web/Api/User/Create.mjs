/**
 * Create a new user on the backend.
 * The admin can create employees w/o passwords, then employee can activate it later.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_User_Create {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_User_Create} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     * @param {Fl32_Auth_Back_Mod_Password} modPass
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_User_Create$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
            Fl32_Auth_Back_Mod_Password$: modPass,
        }
    ) {
        // VARS
        const A_USER = rdbUser.getAttributes();


        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_User_Create.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_User_Create.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                const email = req.email;
                const keyEncrypt = req.keyEncrypt;
                const keyVerify = req.keyVerify;
                const passwordHash = req.passwordHash;
                const passwordSalt = req.passwordSalt;
                const uuid = req.uuid;
                /** @type {Fl32_Auth_Back_RDb_Schema_User.Dto} */
                const found = await crud.readOne(trx, rdbUser, {[A_USER.UUID]: uuid});
                if (!found) {
                    // register the new user
                    const dto = rdbUser.createDto();
                    dto.key_encrypt = keyEncrypt;
                    dto.key_verify = keyVerify;
                    dto.uuid = uuid;
                    const {[A_USER.BID]: bid} = await crud.create(trx, rdbUser, dto);
                    logger.info(`The new user '${uuid}' is created as #${bid}.`);
                    // register password if exists
                    if (email) {
                        await modPass.create({trx, userBid: bid, email, hash: passwordHash, salt: passwordSalt});
                        logger.info(`The password record is created for the user #${bid}.`);
                    }
                    // compose the API response
                    res.bid = bid;
                    res.success = true;
                    res.uuid = uuid;
                } else {
                    logger.error(`Cannot create new user. The user with UUID '${uuid}' already exists (bid: ${found.bid}).`);
                }
                await trx.commit();
                logger.info(`Response: ${JSON.stringify(res)}`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }
}

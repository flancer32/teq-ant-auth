/**
 * Registers the current user on the backend: creates new one or confirms existence.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_User_Register {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_User_Register} endpoint
     * @param {TeqFw_Core_Back_Util_Cast} cast
     * @param {Fl32_Auth_Back_Util_Codec} codec
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPassword
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_User_Register$: endpoint,
            TeqFw_Core_Back_Util_Cast$: cast,
            Fl32_Auth_Back_Util_Codec$: codec,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Password$: rdbPassword,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const A_USER = rdbUser.getAttributes();


        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_User_Register.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_User_Register.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                const email = req.email;
                const hash = req.passwordHash;
                const keyEncrypt = req.keyEncrypt;
                const keyVerify = req.keyVerify;
                const salt = req.passwordSalt;
                const userUuid = req.uuid;
                /** @type {Fl32_Auth_Back_RDb_Schema_User.Dto} */
                const found = await crud.readOne(trx, rdbUser, {[A_USER.UUID]: userUuid});
                if (!found) {
                    // register the new user
                    const dto = rdbUser.createDto();
                    dto.key_encrypt = keyEncrypt;
                    dto.key_verify = keyVerify;
                    dto.uuid = userUuid;
                    const {[A_USER.BID]: bid} = await crud.create(trx, rdbUser, dto);
                    // register password if exists
                    if (email) {
                        const dtoPass = rdbPassword.createDto();
                        dtoPass.email = email;
                        dtoPass.user_ref = bid;
                        if (hash) {
                            const binHash = codec.b64UrlToBin(hash);
                            dtoPass.hash = cast.uint8(binHash);
                        }
                        if (salt) {
                            const binSalt = codec.b64UrlToBin(salt);
                            dtoPass.salt = cast.uint8(binSalt);
                        }
                        await crud.create(trx, rdbPassword, dtoPass);
                    }
                    res.isNew = true;
                    res.success = true;
                    logger.info(`New user '${userUuid}' is registered as #${bid}.`);
                } else {
                    // update the last date for existing user
                    found.date_last = new Date();
                    await crud.updateOne(trx, rdbUser, found);
                    res.isNew = false;
                    res.success = true;
                    logger.info(`The existence of the user '${userUuid}' is confirmed.`);
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

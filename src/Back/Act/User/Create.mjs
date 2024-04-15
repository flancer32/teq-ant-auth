/**
 * Register a new user in RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_User_Create {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Back_Util_Cast} cast
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Util_Cast$: cast,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} uuid
         * @param {string} keyEncrypt
         * @param {string} keyVerify
         * @param {string} passHash
         * @param {string} passSalt
         * @param {string} email
         * @param {boolean} enabled
         * @return {Promise<{bid: number}>}
         */
        this.act = async function ({trx, uuid, keyEncrypt, keyVerify, passHash, passSalt, email, enabled}) {
            const dtoUser = rdbUser.createDto();
            dtoUser.enabled = enabled;
            dtoUser.key_encrypt = keyEncrypt;
            dtoUser.key_verify = keyVerify;
            dtoUser.uuid = uuid;
            const {[ATTR.BID]: bid} = await crud.create(trx, rdbUser, dtoUser);
            logger.info(`New user is created: ${uuid}/bid.`);
            if (passHash && passSalt) {
                const dtoPass = rdbPass.createDto();
                dtoPass.date_updated = new Date();
                dtoPass.email = email;
                dtoPass.hash = cast.buffer(passHash);
                dtoPass.salt = cast.buffer(passSalt);
                dtoPass.user_ref = bid;
                await crud.create(trx, rdbPass, dtoPass);
            }
            return {bid};
        };
    }

}
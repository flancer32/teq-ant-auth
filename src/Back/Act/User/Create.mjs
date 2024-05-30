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
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Password} rdbPass
     * @param {Fl32_Auth_Back_Store_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Util_Cast$: cast,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Password$: rdbPass,
            Fl32_Auth_Back_Store_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} uuid
         * @param {string} [email]
         * @param {string} [keyEncrypt]
         * @param {string} [keyVerify]
         * @param {string} [passHash]
         * @param {string} [passSalt]
         * @param {boolean} [enabled]
         * @return {Promise<{bid: number}>}
         */
        this.act = async function ({trx, uuid, email, keyEncrypt, keyVerify, passHash, passSalt, enabled}) {
            const dtoUser = rdbUser.createDto();
            dtoUser.enabled = enabled ?? false;
            dtoUser.key_encrypt = keyEncrypt;
            dtoUser.key_verify = keyVerify;
            dtoUser.uuid = uuid;
            const {[ATTR.BID]: bid} = await crud.create(trx, rdbUser, dtoUser);
            logger.info(`The new user is created: ${uuid}/bid.`);
            if (email) {
                const dtoPass = rdbPass.createDto();
                dtoPass.date_updated = new Date();
                dtoPass.email = email;
                dtoPass.user_ref = bid;
                if (passHash) dtoPass.hash = cast.buffer(passHash);
                if (passSalt) dtoPass.salt = cast.buffer(passSalt);
                await crud.create(trx, rdbPass, dtoPass);
                logger.info(`The password record is created for the new user ${uuid}/bid.`);
            }
            return {bid};
        };
    }

}
/**
 * Read the user data from the RDB as a shared and RDB DTOs.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_User_Read {
    /**
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     * @param {Fl32_Auth_Back_Convert_User} convUser
     */
    constructor(
        {
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
            Fl32_Auth_Back_Convert_User$: convUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // MAIN
        /**
         * The structure of the returned value.
         * @typedef {Object} ActResult
         * @property {Fl32_Auth_Shared_Dto_User.Dto} shared
         * @property {Fl32_Auth_Back_RDb_Schema_User.Dto} [rdb] @deprecated use `db` prefix
         * @property {Fl32_Auth_Back_RDb_Schema_Password.Dto} [dbPass]
         * @property {Fl32_Auth_Back_RDb_Schema_User.Dto} [dbUser]
         * @memberof Fl32_Auth_Back_Act_User_Read
         */

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} uuid
         * @param {boolean} withPass
         * @return {Promise<ActResult>}
         */
        this.act = async function ({trx, uuid, withPass}) {
            /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
            let dbPass;
            /** @type {Fl32_Auth_Back_RDb_Schema_User.Dto} */
            let dbUser;
            /** @type {Fl32_Auth_Shared_Dto_User.Dto} */
            let shared;
            if (uuid) {
                dbUser = await crud.readOne(trx, rdbUser, {[ATTR.UUID]: uuid});
                if (dbUser) {
                    shared = convUser.rdb2share(dbUser);
                    if (withPass) {
                        dbPass = await crud.readOne(trx, rdbPass, dbUser.bid);
                    }
                }
            }
            return {shared, rdb: dbUser, dbUser, dbPass};
        };
    }

}
/**
 * Read the user data from the RDB as a shared DTO.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_User_Read {
    /**
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     * @param {Fl32_Auth_Back_Convert_User} convUser
     */
    constructor(
        {
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
            Fl32_Auth_Back_Convert_User$: convUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} [uuid]
         * @return {Promise<{shared: Fl32_Auth_Shared_Dto_User.Dto, rdb: Fl32_Auth_Back_RDb_Schema_User.Dto}>}
         */
        this.act = async function ({trx, uuid}) {
            /** @type {Fl32_Auth_Back_RDb_Schema_User.Dto} */
            let rdb;
            /** @type {Fl32_Auth_Shared_Dto_User.Dto} */
            let shared;
            if (uuid) {
                rdb = await crud.readOne(trx, rdbUser, {[ATTR.UUID]: uuid});
                if (rdb) shared = convUser.rdb2share(rdb);
            }
            return {shared, rdb};
        };
    }

}
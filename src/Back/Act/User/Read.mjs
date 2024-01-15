/**
 * Read user data from RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_User_Read {
    /**
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} [uuid]
         * @return {Promise<Fl32_Auth_Back_RDb_Schema_User.Dto>}
         */
        this.act = async function ({trx, uuid}) {
            if (uuid) {
                return await crud.readOne(trx, rdbUser, {[ATTR.UUID]: uuid});
            }
            return null;
        };
    }

}
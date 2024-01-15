/**
 * Read front data from RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_Front_Read {
    /**
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Front} rdbFront
     */
    constructor(
        {
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Front$: rdbFront,
        }
    ) {
        // VARS
        const ATTR = rdbFront.getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} [uuid]
         * @return {Promise<Fl32_Auth_Back_RDb_Schema_Front.Dto>}
         */
        this.act = async function ({trx, uuid}) {
            if (uuid) {
                return await crud.readOne(trx, rdbFront, {[ATTR.UUID]: uuid});
            }
            return null;
        };
    }

}
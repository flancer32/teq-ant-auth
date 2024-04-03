/**
 * Create the new front record in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_Front_Create {
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
         * @param {boolean} [enabled]
         * @param {string} [keyEncrypt]
         * @param {string} [keyVerify]
         * @param {string} uuid
         * @return {Promise<{bid:number}>}
         */
        this.act = async function ({trx, enabled, keyEncrypt, keyVerify, uuid}) {
            const dto = rdbFront.createDto();
            dto.date_created = new Date();
            dto.date_last = new Date();
            dto.enabled = enabled;
            dto.key_encrypt = keyEncrypt;
            dto.key_verify = keyVerify;
            dto.uuid = uuid;
            const {[ATTR.BID]: bid} = await crud.create(trx, rdbFront, dto);
            return {bid};
        };
    }

}
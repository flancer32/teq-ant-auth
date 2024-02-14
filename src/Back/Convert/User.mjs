/**
 * Convert shared DTO from/to other related DTOs (RDB, ...).
 */
export default class Fl32_Auth_Back_Convert_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl32_Auth_Shared_Dto_User} shared
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdb
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl32_Auth_Shared_Dto_User$: shared,
            Fl32_Auth_Back_RDb_Schema_User$: rdb,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Fl32_Auth_Back_RDb_Schema_User.Dto} [data]
         * @returns {Fl32_Auth_Shared_Dto_User.Dto}
         */
        this.rdb2share = function (data) {
            const res = shared.createDto();
            res.dateCreated = cast.date(data?.date_created);
            res.dateLast = cast.date(data?.date_last);
            res.enabled = cast.boolean(data?.enabled);
            res.keyEncrypt = cast.string(data?.key_encrypt);
            res.keyVerify = cast.string(data?.key_verify);
            res.uuid = cast.string(data?.uuid);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Dto_User.Dto} [data]
         * @returns {Fl32_Auth_Back_RDb_Schema_User.Dto}
         */
        this.shared2rdb = function (data) {
            const res = rdb.createDto();
            res.date_created = cast.date(data?.dateCreated);
            res.date_last = cast.date(data?.dateLast);
            res.enabled = cast.boolean(data?.enabled);
            res.key_encrypt = cast.string(data?.keyEncrypt);
            res.key_verify = cast.string(data?.keyVerify);
            res.uuid = cast.string(data?.uuid);
            return res;
        };
    }
}

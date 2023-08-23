/**
 *  Metadata for RDB entity: passwords to authenticate users.
 *  @namespace Fl32_Auth_Back_RDb_Schema_Password
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_RDb_Schema_Password';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/password';

/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Password
 * @type {Object}
 */
const ATTR = {
    DATE_UPDATED: 'date_updated',
    HASH: 'hash',
    SALT: 'salt',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Password
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    date_updated;
    /** @type {Uint8Array} */
    hash;
    /** @type {Uint8Array} */
    salt;
    /** @type {number} */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Password {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Back_Util_Cast.castBuffer|function} castBuffer
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            'TeqFw_Core_Back_Util_Cast.castBuffer': castBuffer,
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
        }) {
        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Back_RDb_Schema_Password.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Password.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_updated = castDate(data?.date_updated);
            res.hash = castBuffer(data?.hash);
            res.salt = castBuffer(data?.salt);
            res.user_ref = castInt(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_RDb_Schema_Password.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.USER_REF],
            Dto
        );
    }

}
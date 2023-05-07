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
    constructor(spec) {
        /** @type {Fl32_Auth_Back_Defaults} */
        const DEF = spec['Fl32_Auth_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBin|function} */
        const castBin = spec['TeqFw_Core_Shared_Util_Cast.castBin'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Back_RDb_Schema_Password.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Password.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_updated = castDate(data?.date_updated);
            res.hash = castBin(data?.hash);
            res.salt = castBin(data?.salt);
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
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
    EMAIL: 'email',
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
    /**
     * Email to restore the access to the user account.
     * @type {string}
     */
    email;
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
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {TeqFw_Core_Back_Util_Cast} castBack
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            TeqFw_Core_Shared_Util_Cast$: cast,
            TeqFw_Core_Back_Util_Cast$: castBack,
        }
    ) {
        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Back_RDb_Schema_Password.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Password.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_updated = cast.date(data?.date_updated);
            res.email = cast.string(data?.email);
            res.hash = castBack.buffer(data?.hash);
            res.salt = castBack.buffer(data?.salt);
            res.user_ref = cast.int(data?.user_ref);
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
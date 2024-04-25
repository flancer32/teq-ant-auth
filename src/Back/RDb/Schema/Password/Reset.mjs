/**
 *  Metadata for RDB entity: unique codes for password reset .
 *  @namespace Fl32_Auth_Back_RDb_Schema_Password_Reset
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_RDb_Schema_Password_Reset';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/password/reset';

/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Password_Reset
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_CREATED: 'date_created',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Password_Reset
 */
class Dto {
    static namespace = NS;
    /**
     * Unique code to launch reset process for the user (UUID).
     * @type {string}
     */
    code;
    /**
     * UTC date when code was created in RDB.
     * @type {Date}
     */
    date_created;
    /**
     * User for whom we need to reset password.
     * @type {number}
     */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Password_Reset {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Back_RDb_Schema_Password_Reset.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Password_Reset.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.code = cast.string(data?.code);
            res.date_created = cast.date(data?.date_created);
            res.user_ref = cast.int(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_RDb_Schema_Password_Reset.ATTR}
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

/**
 *  Metadata for RDB entity: established users sessions.
 *  @namespace Fl32_Auth_Back_RDb_Schema_Session
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_RDb_Schema_Session';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/session';

/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Session
 * @type {Object}
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    CODE: 'code',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Session
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    date_created;
    /** @type {string} */
    code;
    /** @type {number} */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Session {
    constructor(spec) {
        /** @type {Fl32_Auth_Back_Defaults} */
        const DEF = spec['Fl32_Auth_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Back_RDb_Schema_Session.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Session.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_created = castDate(data?.date_created);
            res.code = castString(data?.code);
            res.user_ref = castInt(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_RDb_Schema_Session.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.CODE],
            Dto
        );
    }

}
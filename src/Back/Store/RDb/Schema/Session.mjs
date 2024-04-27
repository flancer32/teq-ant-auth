/**
 *  Metadata for RDB entity: relations between users and fronts.
 *  @namespace Fl32_Auth_Back_Store_RDb_Schema_Session
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Store_RDb_Schema_Session';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/session';

/**
 * @memberOf Fl32_Auth_Back_Store_RDb_Schema_Session
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_CREATED: 'date_created',
    FRONT_REF: 'front_ref',
    USER_REF: 'user_ref',
    WORD: 'word',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_Store_RDb_Schema_Session
 */
class Dto {
    static namespace = NS;
    /**
     * The ID of the session (cookies stored).
     * @type {string}
     */
    code;
    /** @type {Date} */
    date_created;
    /** @type {Date} */
    date_last;
    /** @type {number} */
    front_ref;
    /** @type {number} */
    user_ref;
    /**
     * The secret word for the session (locally stored on the front).
     * @type {string}
     */
    word;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_Store_RDb_Schema_Session {
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
         * @param {Fl32_Auth_Back_Store_RDb_Schema_Session.Dto} [data]
         * @return {Fl32_Auth_Back_Store_RDb_Schema_Session.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.code = cast.string(data?.code);
            res.date_created = cast.date(data?.date_created);
            res.date_last = cast.date(data?.date_last);
            res.front_ref = cast.int(data?.front_ref);
            res.user_ref = cast.int(data?.user_ref);
            res.word = cast.string(data?.word);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_Store_RDb_Schema_Session.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.USER_REF, ATTR.FRONT_REF],
            Dto
        );
    }

}
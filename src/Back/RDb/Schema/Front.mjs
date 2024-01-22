/**
 * The registry for frontends.
 *
 * The front is a separate browser's space with a local stores (localStorage, cache, IDB).
 * The front can or cannot be bound to a user.
 *
 * @namespace Fl32_Auth_Back_RDb_Schema_Front
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_RDb_Schema_Front';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/front';

/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Front
 * @type {Object}
 */
const ATTR = {
    BID: 'bid',
    DATE_CREATED: 'date_created',
    DATE_LAST: 'date_last',
    UUID: 'uuid',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Front
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    bid;
    /** @type {Date} */
    date_created;
    /** @type {Date} */
    date_last;
    /** @type {string} */
    uuid;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Front {
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
         * @param {Fl32_Auth_Back_RDb_Schema_Front.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Front.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.bid = cast.int(data?.bid);
            res.date_created = cast.date(data?.date_created);
            res.date_last = cast.date(data?.date_last);
            res.uuid = cast.string(data?.uuid);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_RDb_Schema_Front.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.BID],
            Dto
        );
    }

}
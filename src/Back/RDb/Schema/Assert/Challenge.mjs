/**
 *  Metadata for RDB entity: challenge to authenticate a user.
 *  @namespace Fl32_Auth_Back_RDb_Schema_Assert_Challenge
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_RDb_Schema_Assert_Challenge';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/assert/challenge';

/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Assert_Challenge
 * @type {Object}
 */
const ATTR = {
    ATTEST_REF: 'attest_ref',
    CHALLENGE: 'challenge',
    DATE_CREATED: 'date_created',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Assert_Challenge
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    attest_ref;
    /** @type {Buffer} */
    challenge;
    /** @type {Date} */
    date_created;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Assert_Challenge {
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
         * @param {Fl32_Auth_Back_RDb_Schema_Assert_Challenge.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Assert_Challenge.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.attest_ref = castInt(data?.attest_ref);
            res.challenge = castBuffer(data?.challenge);
            res.date_created = castDate(data?.date_created);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_RDb_Schema_Assert_Challenge.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.CHALLENGE],
            Dto
        );
    }

}
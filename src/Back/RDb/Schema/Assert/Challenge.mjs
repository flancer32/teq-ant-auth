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
    /** @type {string} */
    challenge;
    /** @type {Date} */
    date_created;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Assert_Challenge {
    constructor(spec) {
        /** @type {Fl32_Auth_Back_Defaults} */
        const DEF = spec['Fl32_Auth_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Back_RDb_Schema_Assert_Challenge.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Assert_Challenge.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.attest_ref = castInt(data?.attest_ref);
            res.challenge = castString(data?.challenge);
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
/**
 *  Metadata for RDB entity: public keys to authenticate users (WebAuthn API).
 *  @namespace Fl32_Auth_Back_RDb_Schema_Attest
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_RDb_Schema_Attest';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/attest';

/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Attest
 * @type {Object}
 */
const ATTR = {
    ATTESTATION_ID: 'attestation_id',
    BID: 'bid',
    DATE_CREATED: 'date_created',
    PUBLIC_KEY: 'public_key',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Back_RDb_Schema_Attest
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    attestation_id;
    /** @type {number} */
    bid;
    /** @type {Date} */
    date_created;
    /** @type {string} */
    public_key;
    /** @type {number} */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Auth_Back_RDb_Schema_Attest {
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
         * @param {Fl32_Auth_Back_RDb_Schema_Attest.Dto} [data]
         * @return {Fl32_Auth_Back_RDb_Schema_Attest.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.attestation_id = castString(data?.attestation_id);
            res.bid = castInt(data?.bid);
            res.public_key = castString(data?.public_key);
            res.date_created = castDate(data?.date_created);
            res.user_ref = castInt(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_RDb_Schema_Attest.ATTR}
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
/**
 *  Metadata for RDB entity: public keys to authenticate users (WebAuthn API).
 *  @namespace Fl32_Auth_Back_Store_RDb_Schema_Attest
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Store_RDb_Schema_Attest';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl32/auth/attest';

/**
 * @memberOf Fl32_Auth_Back_Store_RDb_Schema_Attest
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
 * @memberOf Fl32_Auth_Back_Store_RDb_Schema_Attest
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
export default class Fl32_Auth_Back_Store_RDb_Schema_Attest {
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
         * @param {Fl32_Auth_Back_Store_RDb_Schema_Attest.Dto} [data]
         * @return {Fl32_Auth_Back_Store_RDb_Schema_Attest.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.attestation_id = cast.string(data?.attestation_id);
            res.bid = cast.int(data?.bid);
            res.public_key = cast.string(data?.public_key);
            res.date_created = cast.date(data?.date_created);
            res.user_ref = cast.int(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Fl32_Auth_Back_Store_RDb_Schema_Attest.ATTR}
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
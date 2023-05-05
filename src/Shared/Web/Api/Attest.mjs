/**
 * Validate the new attestation on the backend and save the user's public key if it is validated.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Attest';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Attest
 */
class Request {
    static namespace = NS;
    /**
     * Public key credentials to validate.
     * @type {Fl32_Auth_Shared_Dto_Attest.Dto}
     */
    cred;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Attest
 */
class Response {
    static namespace = NS;
    /**
     * Base64url encoded value.
     * @type {string}
     */
    attestationId;
    /** @type {number} */
    publicKeyBid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Attest {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {Fl32_Auth_Shared_Dto_Attest} */
        const dtoCred = spec['Fl32_Auth_Shared_Dto_Attest$'];

        // INSTANCE METHODS

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Attest.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Attest.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.cred = dtoCred.createDto(data?.cred);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Attest.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Attest.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.publicKeyBid = castInt(data?.publicKeyBid);
            return res;
        };
    }

}

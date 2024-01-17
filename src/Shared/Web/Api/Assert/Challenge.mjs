/**
 * Create a new challenge for user sign-in.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Assert_Challenge';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Assert_Challenge
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    attestationId;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Assert_Challenge
 */
class Response {
    static namespace = NS;
    /**
     * Base64url encoded value.
     * @type {string}
     */
    attestationId;
    /**
     * base64url encoded binary data (32 bytes).
     * @type {string}
     */
    challenge;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Assert_Challenge {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} util
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: util,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.attestationId = util.castString(data?.attestationId);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.attestationId = util.castString(data?.attestationId);
            res.challenge = util.castString(data?.challenge);
            return res;
        };
    }

}

/**
 * Validate the user's assertion using the public key.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Assert_Validate';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Assert_Validate
 */
class Request {
    static namespace = NS;
    /**
     * Base64url encoded binary value for `AuthenticatorAssertionResponse.authenticatorData`.
     * @type {string}
     */
    authenticatorData;
    /**
     * Base64url encoded binary value for `AuthenticatorResponse.clientDataJSON`.
     * @type {string}
     */
    clientData;
    /**
     * Base64url encoded binary value for `AuthenticatorAssertionResponse.signature`.
     * @type {string}
     */
    signature;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Assert_Validate
 */
class Response {
    static namespace = NS;
    /**
     * 'true' if user session is successfully established.
     * @type {boolean}
     */
    success;
    /**
     * App-specific data for the newly established session.
     * @type {Object}
     */
    sessionData;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Assert_Validate {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Validate.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Assert_Validate.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.authenticatorData = cast.string(data?.authenticatorData);
            res.clientData = cast.string(data?.clientData);
            res.signature = cast.string(data?.signature);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Validate.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Assert_Validate.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.success = cast.boolean(data?.success);
            res.sessionData = structuredClone(data?.sessionData);
            return res;
        };
    }

}

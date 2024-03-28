/**
 * Register the current frontend UUID on the backend and get identification data in the response.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Front_Register';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Front_Register
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    frontUuid;
    /**
     * The front's public key to encrypt data.
     * @type {string}
     */
    keyEncrypt;
    /**
     * The front's public key to verify signatures.
     * @type {string}
     */
    keyVerify;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Front_Register
 */
class Response {
    static namespace = NS;
    /** @type {string} */
    backUuid;
    /**
     * 'true' if this is a first-time registration.
     * @type {boolean}
     */
    isNew;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Front_Register {
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
         * @param {Fl32_Auth_Shared_Web_Api_Front_Register.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Front_Register.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.frontUuid = cast.string(data?.frontUuid);
            res.keyEncrypt = cast.string(data?.keyEncrypt);
            res.keyVerify = cast.string(data?.keyVerify);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Front_Register.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Front_Register.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.backUuid = cast.string(data?.backUuid);
            res.isNew = cast.boolean(data?.isNew);
            return res;
        };
    }

}

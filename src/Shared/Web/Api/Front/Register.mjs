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
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Front_Register
 */
class Response {
    static namespace = NS;
    /** @type {string} */
    backUuid;
    /** @type {number} */
    frontBid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Front_Register {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
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
            res.frontUuid = castString(data?.frontUuid);
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
            res.backUuid = castString(data?.backUuid);
            res.frontBid = castInt(data?.frontBid);
            return res;
        };
    }

}

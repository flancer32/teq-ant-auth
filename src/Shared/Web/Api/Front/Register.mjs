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
    /**
     * @type {number}
     * @deprecated we should not use backend data on the front
     */
    frontBid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Front_Register {
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
         * @param {Fl32_Auth_Shared_Web_Api_Front_Register.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Front_Register.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.frontUuid = util.castString(data?.frontUuid);
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
            res.backUuid = util.castString(data?.backUuid);
            res.frontBid = util.castInt(data?.frontBid);
            return res;
        };
    }

}

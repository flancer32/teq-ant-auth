/**
 * Generate and email the link to reset the user's password if the given email exists.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Password_Reset_Init';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Reset_Init
 */
class Request {
    static namespace = NS;
    /**
     * The email under which the user is registered.
     * @type {string}
     */
    email;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Reset_Init
 */
class Response {
    static namespace = NS;
    /**
     * 'true' if the request was processed successfully (w/o errors).
     * @type {boolean}
     */
    success;
}


/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Password_Reset_Init {
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
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.email = cast.string(data?.email);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.success = cast.boolean(data?.success);
            return res;
        };
    }

}

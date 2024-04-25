/**
 * Load the data to reset the user's password.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Password_Reset_Check';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Reset_Check
 */
class Request {
    static namespace = NS;
    /**
     * The code for reset password link.
     * @type {string}
     */
    code;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Reset_Check
 */
class Response {
    static namespace = NS;
    /** @type {string} */
    email;
    /**
     * 'true' if the request was processed successfully (w/o errors).
     * @type {boolean}
     */
    success;
}


/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Password_Reset_Check {
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
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.code = cast.string(data?.code);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.email = cast.string(data?.email);
            res.success = cast.boolean(data?.success);
            return res;
        };
    }

}

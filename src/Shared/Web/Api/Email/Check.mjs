/**
 * Validate the uniqueness of the user email.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Email_Check';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Email_Check
 */
class Request {
    static namespace = NS;
    /**
     * The email to check.
     * @type {string}
     */
    email;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Email_Check
 */
class Response {
    static namespace = NS;
    /**
     * 'true' if the email is unique.
     * @type {boolean}
     */
    isUnique;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Email_Check {
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
         * @param {Fl32_Auth_Shared_Web_Api_Email_Check.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Email_Check.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.email = cast.string(data?.email);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Email_Check.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Email_Check.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.isUnique = cast.boolean(data?.isUnique);
            return res;
        };
    }

}

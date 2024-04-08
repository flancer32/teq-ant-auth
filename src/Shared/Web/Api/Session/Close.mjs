/**
 * Close the session for the current user.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Session_Close';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Session_Close
 */
class Request {
    static namespace = NS;
    /**
     * The session word is stored in the localStorage to indicate that the session is established.
     * @type {string}
     */
    sessionWord;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Session_Close
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Session_Close {
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
         * @param {Fl32_Auth_Shared_Web_Api_Session_Close.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Session_Close.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.sessionWord = cast.string(data?.sessionWord);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Session_Close.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Session_Close.Response}
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

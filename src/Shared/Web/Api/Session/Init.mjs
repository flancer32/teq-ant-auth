/**
 * Initialize the session and fetch user data from the backend using the session ID stored in cookies.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Session_Init';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Session_Init
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    frontUuid;
    /** @type {string} */
    userUuid;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Session_Init
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
export default class Fl32_Auth_Shared_Web_Api_Session_Init {
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
         * @param {Fl32_Auth_Shared_Web_Api_Session_Init.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Session_Init.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.frontUuid = util.castString(data?.frontUuid);
            res.userUuid = util.castString(data?.userUuid);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Session_Init.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Session_Init.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.success = util.castBoolean(data?.success);
            res.sessionData = structuredClone(data?.sessionData);
            return res;
        };
    }

}

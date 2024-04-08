/**
 * Validate password for user identified by app specific ID (email, id, uuid, ...).
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Password_Validate';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Validate
 */
class Request {
    static namespace = NS;
    /**
     * HEX string representation of the password's hash.
     * @type {string}
     */
    passwordHash;
    /**
     * User identifier (application-specific).
     * @type {*}
     */
    userRef;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Validate
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
export default class Fl32_Auth_Shared_Web_Api_Password_Validate {
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
         * @param {Fl32_Auth_Shared_Web_Api_Password_Validate.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Password_Validate.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.passwordHash = cast.string(data?.passwordHash);
            res.userRef = structuredClone(data?.userRef);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Validate.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Password_Validate.Response}
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

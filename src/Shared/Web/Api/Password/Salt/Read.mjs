/**
 * Get password salt by user identifier (app specific: email, id, uuid, ...).
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Password_Salt_Read';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Salt_Read
 */
class Request {
    static namespace = NS;
    /**
     * User identifier (application-specific).
     * @type {*}
     */
    userRef;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Salt_Read
 */
class Response {
    static namespace = NS;
    /**
     * HEX string of password salt.
     * @type {string}
     */
    salt;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Password_Salt_Read {
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
         * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.userRef = structuredClone(data?.userRef);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.salt = cast.string(data?.salt);
            return res;
        };
    }

}

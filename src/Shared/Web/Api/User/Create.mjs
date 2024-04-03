/**
 * Create a new user on the backend. The admin can create employees w/o passwords, then employee can activate it later.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_User_Create';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_Create
 */
class Request {
    static namespace = NS;
    /**
     * The email to send the activation link.
     * @type {string}
     */
    email;
    /**
     * The UUID for the new user.
     * @type {string}
     */
    uuid;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_Create
 */
class Response {
    static namespace = NS;
    /**
     * To use in desk apps.
     * @type {number}
     */
    bid;
    /**
     * @type {boolean}
     */
    success;
    /**
     * To use in client apps.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_User_Create {
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
         * @param {Fl32_Auth_Shared_Web_Api_User_Create.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_User_Create.Request}
         */
        this.createReq = function (data) {
            // create a new DTO
            const res = new Request();
            // cast known attributes
            res.email = cast.string(data?.email);
            res.uuid = cast.string(data?.uuid);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_User_Create.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_User_Create.Response}
         */
        this.createRes = function (data) {
            // create a new DTO
            const res = new Response();
            // cast known attributes
            res.bid = cast.int(data?.bid);
            res.success = cast.boolean(data?.success);
            res.uuid = cast.string(data?.uuid);
            return res;
        };
    }

}

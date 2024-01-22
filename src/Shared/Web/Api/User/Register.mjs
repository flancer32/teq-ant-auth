/**
 * This registers the current user on the backend and retrieves the backend ID in the response.
 * The registration fails if a user with the given UUID already exists.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_User_Register';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_Register
 */
class Request {
    static namespace = NS;
    /**
     * The user's public key to encrypt data.
     * @type {string}
     */
    keyEncrypt;
    /**
     * The user's public key to verify signatures.
     * @type {string}
     */
    keyVerify;
    /** @type {string} */
    uuid;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_Register
 */
class Response {
    static namespace = NS;
    /**
     * The backend ID for the user if the user exists or has just been registered.
     * @type {number}
     */
    userBid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_User_Register {
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
         * @param {Fl32_Auth_Shared_Web_Api_User_Register.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_User_Register.Request}
         */
        this.createReq = function (data) {
            // create a new DTO
            const res = new Request();
            // cast known attributes
            res.keyEncrypt = cast.string(data?.keyEncrypt);
            res.keyVerify = cast.string(data?.keyVerify);
            res.uuid = cast.string(data?.uuid);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_User_Register.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_User_Register.Response}
         */
        this.createRes = function (data) {
            // create a new DTO
            const res = new Response();
            // cast known attributes
            res.userBid = cast.int(data?.userBid);
            return res;
        };
    }

}

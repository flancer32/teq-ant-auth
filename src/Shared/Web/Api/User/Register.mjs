/**
 * Registers the authentication data for current user on the backend (UUID, encryption and signature keys,
 * email and password).
 *
 * The registration fails if the given UUID already exists.
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
     * The email to restore password if password authentication is used.
     * @type {string}
     */
    email;
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
    /**
     * The password hash if password authentication is used (base64 encoded).
     * @type {string}
     */
    passwordHash;
    /**
     * The salt to compose the password hash if password authentication is used (base64 encoded).
     * @type {string}
     */
    passwordSalt;
    /** @type {string} */
    uuid;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_Register
 */
class Response {
    static namespace = NS;
    /**
     * `true` if the user is not found on the back and has been registered.
     * @type {boolean}
     */
    isNew;
    /**
     * @type {boolean}
     */
    success;
    /**
     * The backend ID for the user if the user exists or has just been registered.
     * @type {number}
     * @deprecated we should not use backend data on the front
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
            res.email = cast.string(data?.email);
            res.keyEncrypt = cast.string(data?.keyEncrypt);
            res.keyVerify = cast.string(data?.keyVerify);
            res.passwordHash = cast.string(data?.passwordHash);
            res.passwordSalt = cast.string(data?.passwordSalt);
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
            res.isNew = cast.boolean(data?.isNew);
            res.success = cast.boolean(data?.success);
            return res;
        };
    }

}

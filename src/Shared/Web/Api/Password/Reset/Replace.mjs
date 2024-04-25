/**
 * Replace the current password with a new one.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_Password_Reset_Replace';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Reset_Replace
 */
class Request {
    static namespace = NS;
    /**
     * The code for reset password link.
     * @type {string}
     */
    code;
    /**
     * The front's public key to encrypt data.
     * @type {string}
     */
    frontKeyEncrypt;
    /**
     * The front's public key to verify signatures.
     * @type {string}
     */
    frontKeyVerify;
    /**
     * The front UUID.
     * @type {string}
     */
    frontUuid;
    /**
     * The new user's public key to encrypt data.
     * @type {string}
     */
    keyEncrypt;
    /**
     * The new user's public key to verify signatures.
     * @type {string}
     */
    keyVerify;
    /**
     * The base64url encoded hash for the password validation.
     * @type {string}
     */
    passwordHash;
    /**
     * The base64url encoded salt for the password validation.
     * @type {string}
     */
    passwordSalt;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_Password_Reset_Replace
 */
class Response {
    static namespace = NS;
    /**
     * App-specific data for the newly established session.
     * @type {Object}
     */
    sessionData;
    /**
     * The secret word for the session (locally stored on the front).
     * @type {string}
     */
    sessionWord;
    /**
     * The UUID that corresponds to the authenticated user.
     * @type {string}
     */
    userUuid;
}


/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_Password_Reset_Replace {
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
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.code = cast.string(data?.code);
            res.frontKeyEncrypt = cast.string(data?.frontKeyEncrypt);
            res.frontKeyVerify = cast.string(data?.frontKeyVerify);
            res.frontUuid = cast.string(data?.frontUuid);
            res.keyEncrypt = cast.string(data?.keyEncrypt);
            res.keyVerify = cast.string(data?.keyVerify);
            res.passwordHash = cast.string(data?.passwordHash);
            res.passwordSalt = cast.string(data?.passwordSalt);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.sessionData = structuredClone(data?.sessionData);
            res.sessionWord = cast.string(data?.sessionWord);
            res.userUuid = cast.string(data?.userUuid);
            return res;
        };
    }

}

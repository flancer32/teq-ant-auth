/**
 * Read the public key by user UUID.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Web_Api_User_ReadKey';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_ReadKey
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    uuid;
}

/**
 * @memberOf Fl32_Auth_Shared_Web_Api_User_ReadKey
 */
class Response {
    static namespace = NS;
    /** @type {string} */
    publicKey;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl32_Auth_Shared_Web_Api_User_ReadKey {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }) {
        // INSTANCE METHODS

        /**
         * @param {Fl32_Auth_Shared_Web_Api_User_ReadKey.Request} [data]
         * @return {Fl32_Auth_Shared_Web_Api_User_ReadKey.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.uuid = castString(data?.uuid);
            return res;
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_User_ReadKey.Response} [data]
         * @returns {Fl32_Auth_Shared_Web_Api_User_ReadKey.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.publicKey = castString(data?.publicKey);
            return res;
        };
    }

}

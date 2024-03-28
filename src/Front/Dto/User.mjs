/**
 * The identity data for the user.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Front_Dto_User';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Front_Dto_User
 */
class Dto {
    static namespace = NS;
    /**
     * The backend ID for the user if user is registered on the back.
     * @type {number}
     * @deprecated we should not use the backend IDs on the front
     */
    bid;
    /**
     * The asymmetric keys for encryption.
     * @type {Fl32_Auth_Shared_Dto_Crypto_Keys.Dto}
     */
    keysEncrypt;
    /**
     * The asymmetric keys for signing.
     * @type {Fl32_Auth_Shared_Dto_Crypto_Keys.Dto}
     */
    keysSign;
    /**
     * The user session ID if the user is authenticated.
     * @type {string}
     */
    session;
    /**
     * This ID is generated on the front and should be registered on the back.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Front_Dto_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl32_Auth_Shared_Dto_Crypto_Keys} dtoKeys
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl32_Auth_Shared_Dto_Crypto_Keys$: dtoKeys,
        }
    ) {
        /**
         * @param {Fl32_Auth_Front_Dto_User.Dto} [data]
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.bid = cast.int(data?.bid);
            res.keysEncrypt = dtoKeys.createDto(data?.keysEncrypt);
            res.keysSign = dtoKeys.createDto(data?.keysSign);
            res.session = cast.string(data?.session);
            res.uuid = cast.string(data?.uuid);
            return res;
        };
    }
}

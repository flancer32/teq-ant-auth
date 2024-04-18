/**
 * The identity data for the user stored on the front.
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
     * Any application specific data related to the user.
     * @type {*}
     */
    profile;
    /**
     * The user session word if the user is authenticated.
     * @type {string}
     */
    sessionWord;
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
            res.keysEncrypt = dtoKeys.createDto(data?.keysEncrypt);
            res.keysSign = dtoKeys.createDto(data?.keysSign);
            res.profile = structuredClone(data?.profile);
            res.sessionWord = cast.string(data?.sessionWord);
            res.uuid = cast.string(data?.uuid);
            return res;
        };
    }
}

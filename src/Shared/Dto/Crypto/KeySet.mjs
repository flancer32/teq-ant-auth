/**
 * This is a set of encryption keys used to communicate with other users.
 * The user can have a separate pair of keys for each contact.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Dto_Crypto_KeySet';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Dto_Crypto_KeySet
 */
class Dto {
    static namespace = NS;
    /**
     * The base64 encoded public key of the link keys pair on the other side.
     * @type {string}
     */
    otherPub;
    /**
     * Own keys to encrypt/decrypt messages.
     * @type {Fl32_Auth_Shared_Dto_Crypto_Keys.Dto}
     */
    ownKeys;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Shared_Dto_Crypto_KeySet {
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
        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Shared_Dto_Crypto_KeySet.Dto} [data]
         * @return {Fl32_Auth_Shared_Dto_Crypto_KeySet.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.otherPub = cast.string(data?.otherPub);
            res.ownKeys = dtoKeys.createDto(data?.ownKeys);
            return res;
        };
    }
}

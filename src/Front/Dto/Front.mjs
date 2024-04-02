/**
 * The identity data for the frontend app.
 *
 * It was `..._Dto_Identity` before 2024/03/18
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Front_Dto_Front';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Front_Dto_Front
 */
class Dto {
    static namespace = NS;
    /**
     * The backend UUID. If the backend UUID is set then the front is registered on the back.
     * @type {string}
     */
    backUuid;
    /**
     * The backend ID for the front if frontend is registered on the back.
     * @type {number}
     * @deprecated use backUuid as the flag of the registration
     */
    frontBid;
    /**
     * This ID is generated on the front and should be registered on the back.
     * @type {string}
     * TODO: rename to `uuid`
     */
    frontUuid;
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
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Front_Dto_Front {
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
         * @param {Fl32_Auth_Front_Dto_Front.Dto} [data]
         * @return {Fl32_Auth_Front_Dto_Front.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.backUuid = cast.string(data?.backUuid);
            res.frontBid = cast.int(data?.frontBid);
            res.frontUuid = cast.string(data?.frontUuid);
            res.keysEncrypt = dtoKeys.createDto(data?.keysEncrypt);
            res.keysSign = dtoKeys.createDto(data?.keysSign);
            return res;
        };
    }
}

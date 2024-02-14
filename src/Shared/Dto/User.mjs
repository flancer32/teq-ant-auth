/**
 * The user data that has been shared between the back and the front.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Dto_User';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Dto_User
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date-time for the first user registration.
     * @type {Date}
     */
    dateCreated;
    /**
     * UTC date-time for the last user registration.
     * @type {Date}
     */
    dateLast;
    /**
     * @type {boolean}
     */
    enabled;
    /**
     * Public key for encryption.
     * @type {string}
     */
    keyEncrypt;
    /**
     * Public key for signature verification.
     * @type {string}
     */
    keyVerify;
    /**
     * Universal ID among all hosts.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Shared_Dto_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        /**
         * @param {Fl32_Auth_Shared_Dto_User.Dto|Object} [data]
         * @return {Fl32_Auth_Shared_Dto_User.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.dateCreated = cast.date(data?.dateCreated);
            res.dateLast = cast.date(data?.dateLast);
            res.enabled = cast.boolean(data?.enabled);
            res.keyEncrypt = cast.string(data?.keyEncrypt);
            res.keyVerify = cast.string(data?.keyVerify);
            res.uuid = cast.string(data?.uuid);
            return res;
        };
    }
}

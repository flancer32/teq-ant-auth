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
     */
    bid;
    /**
     * The asymmetric keys for cryptography.
     * @type {Fl32_Auth_Shared_Dto_Identity_Keys.Dto}
     */
    keys;
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
     * @param {TeqFw_Core_Shared_Util_Cast} util
     *  @param {Fl32_Auth_Shared_Dto_Identity_Keys} dtoKeys
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: util,
            Fl32_Auth_Shared_Dto_Identity_Keys$: dtoKeys,
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
            res.bid = util.castInt(data?.bid);
            res.keys = dtoKeys.createDto(data?.keys);
            res.session = util.castString(data?.session);
            res.uuid = util.castString(data?.uuid);
            return res;
        };
    }
}

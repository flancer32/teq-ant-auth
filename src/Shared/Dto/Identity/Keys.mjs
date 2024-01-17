/**
 * Keys for asymmetric encryption.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Dto_Identity_Keys';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Dto_Identity_Keys
 */
class Dto {
    static namespace = NS;
    /**
     * Base64 encoded public key.
     * @type {string}
     */
    public;
    /**
     * Base64 encoded secret key.
     * @type {string}
     */
    secret;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Shared_Dto_Identity_Keys {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} util
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: util,
        }
    ) {
        // INSTANCE METHODS
        /**
         * @param {Fl32_Auth_Shared_Dto_Identity_Keys.Dto} [data]
         * @return {Fl32_Auth_Shared_Dto_Identity_Keys.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.public = util.castString(data?.public);
            res.secret = util.castString(data?.secret);
            return res;
        }
    }
}

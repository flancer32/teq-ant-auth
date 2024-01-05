/**
 * The identity data for the frontend app.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Front_Dto_Identity';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Front_Dto_Identity
 */
class Dto {
    static namespace = NS;
    /**
     * The backend UUID.
     * @type {string}
     */
    backUuid;
    /**
     * The backend ID for the front if frontend is registered on the back.
     * @type {number}
     */
    frontBid;
    /**
     * The front UUID
     * @type {string}
     */
    frontUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Front_Dto_Identity {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }
    ) {
        /**
         * @param {Fl32_Auth_Front_Dto_Identity.Dto} [data]
         * @return {Fl32_Auth_Front_Dto_Identity.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.backUuid = castString(data?.backUuid);
            res.frontBid = castInt(data?.frontBid);
            res.frontUuid = castString(data?.frontUuid);
            return res;
        };
    }
}

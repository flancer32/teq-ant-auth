/**
 * Reads the salt for the user's password from RDB and returns it as a HEX string.
 *
 * @namespace Fl32_Auth_Back_Act_Password_Salt_Read
 */

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Password_Salt_Read';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Core_Shared_Util_Codec.binToHex|function} binToHex
 * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
 * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
 */
export default function (
    {
        TeqFw_Core_Shared_Api_Logger$: logger,
        'TeqFw_Core_Shared_Util_Codec.binToHex': binToHex,
        TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
        Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
    }
) {
    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Reads the salt for the user's password from RDB and returns it as a HEX string.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @return {Promise<{salt: string}>}
     * @memberOf Fl32_Auth_Back_Act_Password_Salt_Read
     */
    async function act({trx, userBid}) {
        /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
        const found = await crud.readOne(trx, rdbPass, userBid);
        const salt = (found?.salt) ? binToHex(found.salt) : null;
        return {salt};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
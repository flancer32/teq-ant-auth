/**
 * Validate the password hash for the given user.
 *
 * @namespace Fl32_Auth_Back_Act_Password_Validate
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Password_Validate';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {TeqFw_Core_Shared_Util_Codec.binToHex|function} */
    const binToHex = spec['TeqFw_Core_Shared_Util_Codec.binToHex'];
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Fl32_Auth_Back_RDb_Schema_Password} */
    const rdbPass = spec['Fl32_Auth_Back_RDb_Schema_Password$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Validate the password hash for the given user.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @param {string} hashHex
     * @return {Promise<{success: boolean}>}
     * @memberOf Fl32_Auth_Back_Act_Password_Validate
     */
    async function act({trx, userBid, hashHex}) {
        let success = false;
        // noinspection JSValidateTypes
        /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
        const found = await crud.readOne(trx, rdbPass, userBid);
        if (found) {
            const hashFound = binToHex(found.hash);
            success = (hashFound === hashHex);
        }
        return {success};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
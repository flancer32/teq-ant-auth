/**
 * Validate the password hash for the given user.
 *
 * @namespace Fl32_Auth_Back_Act_Password_Validate
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Password_Validate';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {Fl32_Auth_Back_Util_Codec} codec
 * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
 * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
 */
export default function (
    {
        TeqFw_Core_Shared_Api_Logger$: logger,
        Fl32_Auth_Back_Util_Codec$: codec,
        TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
        Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
    }
) {
    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Validate the password hash for the given user.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @param {string} hash - the representation of the password hash as 'base64url' string.
     * @return {Promise<{success: boolean}>}
     * @memberOf Fl32_Auth_Back_Act_Password_Validate
     */
    async function act({trx, userBid, hash}) {
        let success = false;
        // noinspection JSValidateTypes
        /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
        const found = await crud.readOne(trx, rdbPass, userBid);
        if (found) {
            const hashFound = codec.binToB64Url(found.hash);
            success = (hashFound === hash);
        }
        return {success};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
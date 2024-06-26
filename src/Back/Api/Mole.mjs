/**
 * An interface for an application specific functionality used by this plugin.
 *
 * @interface
 * @deprecated use 'Spy' instead of 'Mole' and DI replacements `..._Di_Fl32_Auth_Back_Api_Spy`
 */
export default class Fl32_Auth_Back_Api_Mole {

    /**
     * Load app specific session data from a storage (RDb, ...).
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {number} userBid
     * @returns {Promise<{sessionData: Object}>}
     */
    async sessionDataRead({trx, userBid}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mole'.`);
    }

    /**
     * Load app specific user data from a storage (RDb, ...).
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {string} userRef - app-specific identifier for the user (email, uuid, ...)
     * @returns {Promise<{userBid:number, user: Object}>}
     */
    async userRead({trx, userRef}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mole'.`);
    }
}

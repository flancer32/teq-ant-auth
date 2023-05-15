/**
 * An interface for an application specific functionality used by this plugin.
 *
 * @interface
 */
export default class Fl32_Auth_Back_Api_Mole {

    /**
     * Load app specific user data from a storage (RDb, ...).
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {string} userRef - app-specific identifier for the user (email, uuid, ...)
     * @returns {Promise<{userBid:number, user: Object}>}
     * TODO: rename to `readUser` (or userRead??)
     */
    async load({trx, userRef}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mole'.`);
    }

    /**
     * Load app specific session data from a storage (RDb, ...).
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {number} userBid
     * @returns {Promise<{sessionData: Object}>}
     */
    async readSessionData({trx, userBid}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mole'.`);
    }
}

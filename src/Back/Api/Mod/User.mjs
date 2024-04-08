/**
 * An interface for an application specific model of the user.
 *
 * @interface
 */
export default class Fl32_Auth_Back_Api_Mod_User {

    /**
     * Load app specific session data from a storage (RDb, ...).
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {number} userBid
     * @returns {Promise<{sessionData: Object}>}
     */
    async sessionDataRead({trx, userBid}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mod_User'.`);
    }

    /**
     * Load app specific user data from a storage (RDb, ...).
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {*} userRef - app-specific identifier for the user (email, uuid, ...) or some object
     * @returns {Promise<{bid:number, dbUser: Fl32_Auth_Back_RDb_Schema_User.Dto}>}
     */
    async userRead({trx, userRef}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mod_User'.`);
    }
}

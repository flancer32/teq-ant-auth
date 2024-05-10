/**
 * An interface for an application specific model of the user.
 * This interface is used by `Fl32_Auth_Back_Mod_Session` to retrieve the app specific user profile.
 *
 * @interface
 */
export default class Fl32_Auth_Back_Api_Mod_User {

    /**
     * Read the application-specific data from storage (RDb, ...) to use on the backend.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {number} userBid
     * @returns {Promise<{profileBack: *, profileFront: *}>}
     */
    async readProfiles({trx, userBid}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mod_User'.`);
    }

    /**
     * Load app specific user data from a storage (RDb, ...).
     * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
     * @param {*} userRef - app-specific identifier for the user (email, uuid, ...) or some object
     * @returns {Promise<{bid:number, dbUser: Fl32_Auth_Back_Store_RDb_Schema_User.Dto}>}
     */
    async read({trx, userRef}) {
        throw new Error(`Please, implement 'Fl32_Auth_Back_Api_Mod_User'.`);
    }
}

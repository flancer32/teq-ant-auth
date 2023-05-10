/**
 * An interface for the session data loader used by `Fl32_Auth_Back_Mod_Session_Store`.
 *
 * The implementation is used by the store to load session-related data from external storages and to save the data
 * in the store. The concrete implementation depends on the application.
 *
 * @interface
 */
export default class Fl32_Auth_Back_Api_Session_Data {

    /**
     * Remove session data from internal cache.
     * @param {string} sessionId - The ID of the session
     */
    clear(sessionId) { }

    /**
     * Get session data loaded into internal cache before.
     * @param {string} sessionId - The ID of the session
     * @returns {Object} - The session data
     */
    get(sessionId) { }

    /**
     * Loads session data from external storage by `sessionId` and place it to internal cache.
     * @param {string} sessionId - The ID of the session
     * @returns {Promise<Object>} - A promise that resolves to an object containing the session data
     */

    async load(sessionId) { }
}

/**
 * A model for aggregating functionality related to the user.
 *
 * @namespace Fl32_Auth_Front_Mod_User
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_User_ReadKey} apiReadKey
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_User_ReadKey$: apiReadKey,
        }) {

        // INSTANCE METHODS

        /**
         * Get public key for the user using the user UUID.
         *
         * @param {string} uuid
         * @returns {Promise<string|null>}
         */
        this.getPublicKey = async function (uuid) {
            try {
                const req = apiReadKey.createReq();
                req.uuid = uuid;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_User_ReadKey.Response} */
                const res = await connApi.send(req, apiReadKey);
                return res?.publicKey ?? null;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get public key for user '${uuid}. Error: ${e?.message}`);
            }
        };
    }
}

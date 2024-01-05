/**
 * A model for aggregating functionality related to the frontend user.
 *
 * @namespace Fl32_Auth_Front_Mod_User
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_User_ReadKey} apiReadKey
     * @param {Fl32_Auth_Front_Store_Local_User} storeUser
     * @param {Fl32_Auth_Front_Mod_Crypto_Key_Manager} modKeyMgr
     * @param {Fl32_Auth_Front_Dto_User} dtoUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_User_ReadKey$: apiReadKey,
            Fl32_Auth_Front_Store_Local_User$: storeUser,
            Fl32_Auth_Front_Mod_Crypto_Key_Manager$: modKeyMgr,
            Fl32_Auth_Front_Dto_User$: dtoUser,
        }
    ) {

        // INSTANCE METHODS

        /**
         * Load user data from local store or create new user, initialize it (UUID & keys) and store locally.
         * @return {Promise<Fl32_Auth_Front_Dto_User.Dto>}
         */
        this.init = async function () {
            const res = storeUser.get();
            if (!res?.uuid || !res?.keys?.public) {
                if (!res?.uuid) res.uuid = self.crypto.randomUUID();
                if (!res?.keys?.public) res.keys = await modKeyMgr.generateAsyncKeys();
                storeUser.set(res);
            }
            return res;
        };

        /**
         * Get public key for a user using the user UUID.
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

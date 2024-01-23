/**
 * A model for aggregating functionality related to the frontend user.
 */
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
        }
    ) {
        // INSTANCE METHODS

        /**
         * Get public keys for a user using the user UUID.
         *
         * @param {string} uuid - the user UUID
         * @param {string} [host] - the host UUID
         * @return {Promise<{keyVerify: string, keyEncrypt: string}>}
         */
        this.getPublicKeys = async function (uuid, host) {
            try {
                const req = apiReadKey.createReq();
                req.host = host;
                req.uuid = uuid;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_User_ReadKey.Response} */
                const {keyEncrypt, keyVerify} = await connApi.send(req, apiReadKey);
                return {keyEncrypt, keyVerify};
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get public key for user '${uuid}. Error: ${e?.message}`);
            }
        };
    }
}

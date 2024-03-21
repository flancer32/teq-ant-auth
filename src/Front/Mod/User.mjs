/**
 * A model for aggregating functionality related to the frontend user.
 */
// MODULE'S VARS
const SALT_BYTES = 16;

// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} api
     * @param {Fl32_Auth_Shared_Web_Api_User_ReadKey} endReadKey
     * @param {Fl32_Auth_Shared_Web_Api_User_Register} endUserReg
     * @param {Fl32_Auth_Front_Mod_Crypto_Key_Manager} modKeyMgr
     * @param {Fl32_Auth_Front_Mod_Password} modPassword
     * @param {Fl32_Auth_Front_Store_Local_User} storeUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: api,
            Fl32_Auth_Shared_Web_Api_User_ReadKey$: endReadKey,
            Fl32_Auth_Shared_Web_Api_User_Register$: endUserReg,
            Fl32_Auth_Front_Mod_Crypto_Key_Manager$: modKeyMgr,
            Fl32_Auth_Front_Mod_Password$: modPassword,
            Fl32_Auth_Front_Store_Local_User$: storeUser,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Get user data stored in the localStorage.
         *
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.get = function () {
            return storeUser.get();
        };

        /**
         * Get public keys for a user using the user UUID.
         *
         * @param {string} uuid - the user UUID
         * @param {string} [host] - the host UUID
         * @return {Promise<{keyVerify: string, keyEncrypt: string}>}
         */
        this.getPublicKeys = async function (uuid, host) {
            try {
                const req = endReadKey.createReq();
                req.host = host;
                req.uuid = uuid;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_User_ReadKey.Response} */
                const {keyEncrypt, keyVerify} = await api.send(req, endReadKey);
                return {keyEncrypt, keyVerify};
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get public key for user '${uuid}. Error: ${e?.message}`);
            }
        };

        /**
         * Init user data on the frontend. Load the user identity from the localStorage or generate and store new one.
         *
         * @return {Promise<Fl32_Auth_Front_Dto_User.Dto>}
         */
        this.init = async function () {
            const res = storeUser.get();
            if (!res?.uuid || !res?.keysEncrypt?.public || !res?.keysSign?.public) {
                if (!res?.uuid) res.uuid = self.crypto.randomUUID();
                if (!res?.keysEncrypt?.public) res.keysEncrypt = await modKeyMgr.createKeysToEncrypt();
                if (!res?.keysSign?.public) res.keysSign = await modKeyMgr.createKeysToSign();
                storeUser.set(res);
            }
            logger.info(`User is initialized.`);
            return res;
        };

        /**
         * Register the user on the back.
         *
         * @param {string} [email]
         * @param {string} [password]
         *
         * @return {Promise<boolean>}
         */
        this.register = async function ({email, password}) {
            const stored = storeUser.get();
            const req = endUserReg.createReq();
            req.keyEncrypt = stored.keysEncrypt.public;
            req.keyVerify = stored.keysSign.public;
            req.uuid = stored.uuid;
            if (email && password) {
                const salt = modPassword.saltNew(SALT_BYTES); // HEX string
                const hash = await modPassword.hashCompose(password, salt);
                req.email = email;
                req.passwordHash = hash;
                req.passwordSalt = salt;
            }
            /** @type {Fl32_Auth_Shared_Web_Api_User_Register.Response} */
            const rs = await api.send(req, endUserReg);
            return rs?.success;
        };
        
    }
}

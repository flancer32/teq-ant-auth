/**
 * A model for aggregating functionality related to the frontend user.
 * The user data is stored in the localStore and is not cached in the model.
 */
export default class Fl32_Auth_Front_Mod_User {
    /**
     * @param {Fl32_Auth_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} api
     * @param {Fl32_Auth_Shared_Web_Api_User_Create} endUserCreate
     * @param {Fl32_Auth_Shared_Web_Api_User_ReadKey} endReadKey
     * @param {Fl32_Auth_Shared_Web_Api_User_Register} endUserReg
     * @param {Fl32_Auth_Front_Mod_Crypto_Key_Manager} modKeyMgr
     * @param {Fl32_Auth_Front_Mod_Password} modPassword
     * @param {Fl32_Auth_Front_Store_Local_User} storeUser
     */
    constructor(
        {
            Fl32_Auth_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: api,
            Fl32_Auth_Shared_Web_Api_User_Create$: endUserCreate,
            Fl32_Auth_Shared_Web_Api_User_ReadKey$: endReadKey,
            Fl32_Auth_Shared_Web_Api_User_Register$: endUserReg,
            Fl32_Auth_Front_Mod_Crypto_Key_Manager$: modKeyMgr,
            Fl32_Auth_Front_Mod_Password$: modPassword,
            Fl32_Auth_Front_Store_Local_User$: storeUser,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Create base user structures.
         * @param {string} [email]
         * @param {string} [password]
         * @param {string} [uuid] - the user UUID if it is not the current user
         * @return {Promise<Fl32_Auth_Shared_Web_Api_User_Create.Response>}
         */
        this.create = async function ({email, password, uuid}) {
            const stored = storeUser.get();
            const req = endUserCreate.createReq();
            req.email = email;
            if (uuid) {
                // create a user w/o password that requires activation
                req.uuid = uuid;
            } else {
                // registry the current user on the back
                req.keyEncrypt = stored.keysEncrypt.public;
                req.keyVerify = stored.keysSign.public;
                req.uuid = stored.uuid;
            }
            if (password) {
                req.passwordSalt = modPassword.saltNew(DEF.SALT_BYTES); // base64url
                req.passwordHash = await modPassword.hashCompose(password, req.passwordSalt); // base64url
            }
            return await api.send(req, endUserCreate);
        };

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
            try {
                const stored = storeUser.get();
                const req = endUserReg.createReq();
                req.keyEncrypt = stored.keysEncrypt.public;
                req.keyVerify = stored.keysSign.public;
                req.uuid = stored.uuid;
                req.email = email;
                if (password) {
                    req.passwordSalt = modPassword.saltNew(DEF.SALT_BYTES); // base64url
                    req.passwordHash = await modPassword.hashCompose(password, req.passwordSalt);
                }
                /** @type {Fl32_Auth_Shared_Web_Api_User_Register.Response} */
                const rs = await api.send(req, endUserReg);
                return Boolean(rs?.success);
            } catch (e) {
                logger.exception(e);
            }
            return false;
        };

        /**
         * Update the user data stored in the localStore.
         *
         * @param {Fl32_Auth_Front_Dto_User.Dto} dto
         */
        this.updateStore = function (dto) {
            storeUser.set(dto);
        };
    }
}

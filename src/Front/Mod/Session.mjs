/**
 * A model for aggregating functionality related to user sessions.
 *
 * This model uses identity & user local stores directly (w/o identity & user models).
 *
 * @namespace Fl32_Auth_Front_Mod_Session
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_Session {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_Session_Close} apiClose
     * @param {Fl32_Auth_Shared_Web_Api_Session_Init} apiInit
     * @param {Fl32_Auth_Front_Mod_Crypto_Key_Manager} modKeyMgr
     * @param {Fl32_Auth_Front_Store_Local_Identity} storeIdentity
     * @param {Fl32_Auth_Front_Store_Local_User} storeUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_Session_Close$: apiClose,
            Fl32_Auth_Shared_Web_Api_Session_Init$: apiInit,
            Fl32_Auth_Front_Mod_Crypto_Key_Manager$: modKeyMgr,
            Fl32_Auth_Front_Store_Local_Identity$: storeIdentity,
            Fl32_Auth_Front_Store_Local_User$: storeUser,
        }) {
        // MAIN
        /** @type {Fl32_Auth_Front_Dto_User.Dto} */
        let _user;
        /**
         * Internal store to cache session data for established session.
         * @type {Object}
         */
        let _store;

        // FUNCS
        async function initUser() {
            const res = storeUser.get();
            if (!res?.uuid || !res?.keys?.public) {
                if (!res?.uuid) res.uuid = self.crypto.randomUUID();
                if (!res?.keys?.public) res.keys = await modKeyMgr.generateAsyncKeys();
                storeUser.set(res);
            }
            return res;
        }

        // INSTANCE METHODS

        /**
         * Close session on the back.
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Session_Close.Response>}
         */
        this.close = async function () {
            try {
                const req = apiClose.createReq();
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Session_Close.Response} */
                const res = await connApi.send(req, apiClose);
                if (res.success) _store = undefined;
                else logger.error(`Cannot close user session on the backend.`);
                return res;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot close user session. Error: ${e?.message}`);
            }
        };

        /**
         * Get session data.
         * @return {Object}
         */
        this.getData = () => _store;
        /**
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.getUser = () => _user;

        /**
         * Initialize established user session (load session data from backend).
         * @return {Promise<void>}
         */
        this.init = async function () {
            try {
                _user = await initUser();
                if (_user?.bid) {
                    const req = apiInit.createReq();
                    req.userUuid = _user.uuid;
                    // noinspection JSValidateTypes
                    /** @type {Fl32_Auth_Shared_Web_Api_Session_Init.Response} */
                    const res = await connApi.send(req, apiInit);
                    if (res?.success) {
                        _store = res?.sessionData;
                        logger.info(`User session is initialized.`);
                    } else _store = undefined;
                } else {
                    _store = undefined;
                    logger.info(`User is not registered on the back. The session is not initialized.`);
                }
            } catch (e) {
                // timeout or error
                logger.error(`Cannot initialize user session. Error: ${e?.message}`);
            }
        };

        /**
         * Return 'true' if session data is stored in the model's cache.
         * @returns {boolean}
         */
        this.isValid = () => Boolean(_store);

        /**
         * @param {number} bid
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.setUserBid = function (bid) {
            _user = storeUser.get();
            _user.bid = bid;
            storeUser.set(_user);
            return _user;
        };

        /**
         * Set session data in this model on sign-in or sign-up.
         * @param {Object} data
         */
        this.setData = (data) => _store = data;
    }
}

/**
 * A model for aggregating functionality related to user & front sessions.
 *
 * This model uses identity & user local stores directly (w/o identity & user models).
 */
export default class Fl32_Auth_Front_Mod_Session {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_Front_Register} endFrontReg
     * @param {Fl32_Auth_Shared_Web_Api_User_Register} endUserReg
     * @param {Fl32_Auth_Shared_Web_Api_Session_Close} endClose
     * @param {Fl32_Auth_Shared_Web_Api_Session_Init} endInit
     * @param {Fl32_Auth_Front_Mod_Crypto_Key_Manager} modKeyMgr
     * @param {Fl32_Auth_Front_Mod_Front} modFront
     * @param {Fl32_Auth_Front_Mod_User} modUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_Front_Register$: endFrontReg,
            Fl32_Auth_Shared_Web_Api_User_Register$: endUserReg,
            Fl32_Auth_Shared_Web_Api_Session_Close$: endClose,
            Fl32_Auth_Shared_Web_Api_Session_Init$: endInit,
            Fl32_Auth_Front_Mod_Crypto_Key_Manager$: modKeyMgr,
            Fl32_Auth_Front_Mod_Front$: modFront,
            Fl32_Auth_Front_Mod_User$: modUser,
        }
    ) {
        // MAIN
        /**
         * The private property to cache the front data inside the session model.
         * @type {Fl32_Auth_Front_Dto_Front.Dto}
         */
        let _front;
        /**
         * Internal store to cache session data for established session.
         * @type {Object}
         */
        let _store;
        /**
         * The private property to cache the user data inside the session model.
         * @type {Fl32_Auth_Front_Dto_User.Dto}
         */
        let _user;

        // FUNCS
        /**
         * Initialize front identity on the app startup.
         * @return {Promise<*|Fl32_Auth_Front_Dto_Front.Dto>}
         * @deprecated use `modFront.init()` instead of this method
         */
        async function initFront() {
            // load app identity data (if exists) from the local storage or create new one.
            const res = modFront.get();
            if (!res.frontUuid) {
                res.frontUuid = self.crypto.randomUUID();
                logger.info(`New front UUID '${res.frontUuid}' is generated and should be registered on the back.`);
            }
            // register this front on the back (update the connected time)
            const req = endFrontReg.createReq();
            req.frontUuid = res.frontUuid;
            const rs = await connApi.send(req, endFrontReg);
            if ((res.backUuid !== rs.backUuid) || (res.frontBid !== rs.frontBid)) {
                // update locally stored data if different
                res.backUuid = rs.backUuid;
                res.frontBid = rs.frontBid;
                modFront.updateStore(res);
                logger.info(`The front identity is updated in the localStorage: ${JSON.stringify(res)}`);
            } else {
                logger.info(`The front identity is already synced with the back.`);
            }
            return res;
        }

        /**
         * Load user data from local store or create a new user, initialize it (UUID & keys), and store it locally.
         * Send user data to the server to ensure that the user is signed up on the host.
         * @return {Promise<Fl32_Auth_Front_Dto_User.Dto>}
         * @deprecated use `modUser.init()` instead of this method
         */
        async function initUser() {
            const res = modUser.get();
            if (!res?.uuid || !res?.keysEncrypt?.public || !res?.keysSign?.public) {
                if (!res?.uuid) res.uuid = self.crypto.randomUUID();
                if (!res?.keysEncrypt?.public) res.keysEncrypt = await modKeyMgr.createKeysToEncrypt();
                if (!res?.keysSign?.public) res.keysSign = await modKeyMgr.createKeysToSign();
                modUser.updateStore(res);
            }
            const dto = endUserReg.createReq();
            dto.keyEncrypt = res.keysEncrypt.public;
            dto.keyVerify = res.keysSign.public;
            dto.uuid = res.uuid;
            /** @type {Fl32_Auth_Shared_Web_Api_User_Register.Response} */
            const rs = await connApi.send(dto, endUserReg);
            if (!rs.success) {
                // the user is not registered on the back, throw the error
                throw new Error(`The current user cannot be registered on the back.`);
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
                // remove the session word from the user data stored in the localStorage
                _user = this.getUser();
                _user.sessionWord = undefined;
                modUser.updateStore(_user);
                // remove the current session from the back
                const req = endClose.createReq();
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Session_Close.Response} */
                const res = await connApi.send(req, endClose);
                if (res.success) _store = undefined;
                else logger.error(`Cannot close user session on the backend.`);
                return res;
            } catch (e) {
                logger.exception(e);
            }
        };

        /**
         * @return {string}
         */
        this.getBackUuid = () => modFront.get()?.backUuid;

        /**
         * Get session data.
         * @return {Object}
         */
        this.getData = () => _store;

        /**
         * @return {Fl32_Auth_Front_Dto_Front.Dto}
         */
        this.getFront = function () {
            if (!_front) _front = modFront.get();
            return _front;
        };

        /**
         * @return {number}
         * @deprecated don't use the backend IDs on the front
         */
        this.getFrontBid = () => modFront.get()?.frontBid;

        /**
         * @return {string}
         */
        this.getFrontUuid = () => this.getFront()?.frontUuid;

        /**
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.getUser = function () {
            if (!_user) _user = modUser.get();
            return _user;
        };

        /**
         * @return {string}
         */
        this.getUserSessionId = () => _user?.sessionWord;

        /**
         * @return {string}
         */
        this.getUserUuid = () => this.getUser()?.uuid;

        /**
         * Initialize the frontend & user data then connect to the back to update the session.
         * @return {Promise<void>}
         */
        this.init = async function () {
            try {
                await modFront.init();
                _user = await modUser.init();
                if (_user?.sessionWord) {
                    // TODO: should we ever use the user session (we have asymmetric encryption)?
                    const req = endInit.createReq();
                    req.userUuid = _user.uuid;
                    // noinspection JSValidateTypes
                    /** @type {Fl32_Auth_Shared_Web_Api_Session_Init.Response} */
                    const res = await connApi.send(req, endInit);
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

        this.isAuthenticated = function () {
            return Boolean(this.getUser()?.sessionWord);
        };

        /**
         * Return 'true' if session data is stored in the model's cache.
         * @returns {boolean}
         */
        this.isValid = () => Boolean(_store);

        /**
         * @param {number} bid
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         * @deprecated we should not use the backend IDs on the front
         */
        this.setUserBid = function (bid) {
            // _user = storeUser.get();
            // _user.bid = bid;
            // storeUser.set(_user);
            // return _user;
            throw new Error('This is a deprecated method.');
        };

        /**
         * Save the session word locally. This indicates that the user session is established.
         * @param {string} word
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         * @deprecated use Fl32_Auth_Front_Mod_Session.updateUser
         */
        this.setSessionWord = function (word) {
            _user = modUser.get();
            _user.sessionWord = word;
            modUser.updateStore(_user);
            return _user;
        };

        /**
         * Set session data in this model on sign-in or sign-up.
         * @param {Object} data
         */
        this.setData = (data) => _store = data;

        /**
         * Update the user data in the memory and in the localStorage.
         * @param {Fl32_Auth_Front_Dto_User.Dto} data
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.updateUser = function (data) {
            _user = data;
            modUser.updateStore(data);
            return _user;
        };
    }
}

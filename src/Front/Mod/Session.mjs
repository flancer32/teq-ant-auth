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
     * @param {Fl32_Auth_Front_Store_Local_Front} storeFront
     * @param {Fl32_Auth_Front_Store_Local_User} storeUser
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
            Fl32_Auth_Front_Store_Local_Front$: storeFront,
            Fl32_Auth_Front_Store_Local_User$: storeUser,
        }
    ) {
        // MAIN
        /** @type {Fl32_Auth_Front_Dto_Front.Dto} */
        let _front;
        /**
         * Internal store to cache session data for established session.
         * @type {Object}
         */
        let _store;
        /** @type {Fl32_Auth_Front_Dto_User.Dto} */
        let _user;

        // FUNCS
        /**
         * Initialize front identity on the app startup.
         * @return {Promise<*|Fl32_Auth_Front_Dto_Front.Dto>}
         */
        async function initFront() {
            // load app identity data (if exists) from the local storage or create new one.
            const res = storeFront.get();
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
                storeFront.set(res);
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
         */
        async function initUser() {
            const res = storeUser.get();
            if (!res?.uuid || !res?.keysEncrypt?.public || !res?.keysSign?.public) {
                if (!res?.uuid) res.uuid = self.crypto.randomUUID();
                if (!res?.keysEncrypt?.public) res.keysEncrypt = await modKeyMgr.createKeysToEncrypt();
                if (!res?.keysSign?.public) res.keysSign = await modKeyMgr.createKeysToSign();
                storeUser.set(res);
            }
            const dto = endUserReg.createReq();
            dto.keyEncrypt = res.keysEncrypt.public;
            dto.keyVerify = res.keysSign.public;
            dto.uuid = res.uuid;
            /** @type {Fl32_Auth_Shared_Web_Api_User_Register.Response} */
            const rs = await connApi.send(dto, endUserReg);
            if (!rs.userBid) {
                // the user is not registered on the back, throw the error
                throw new Error(`The current user cannot be registered on the back.`);
            } else if (rs.userBid !== res.bid) {
                // this is new registration after RDB cleanup
                res.bid = rs.userBid;
                storeUser.set(res);
                logger.info(`New bid '${res.bid}' is set for the user '${res.uuid}'.`);
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
                const req = endClose.createReq();
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Session_Close.Response} */
                const res = await connApi.send(req, endClose);
                if (res.success) _store = undefined;
                else logger.error(`Cannot close user session on the backend.`);
                return res;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot close user session. Error: ${e?.message}`);
            }
        };

        /**
         * @return {string}
         */
        this.getBackUuid = () => _front?.backUuid;

        /**
         * Get session data.
         * @return {Object}
         */
        this.getData = () => _store;

        /**
         * @return {number}
         */
        this.getFrontBid = () => _front?.frontBid;

        /**
         * @return {string}
         */
        this.getFrontUuid = () => _front?.frontUuid;

        /**
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.getUser = () => _user;

        /**
         * @return {string}
         */
        this.getUserSessionId = () => _user?.session;

        /**
         * @return {string}
         */
        this.getUserUuid = () => _user?.uuid;

        /**
         * @return {boolean}
         * @deprecated we should define it on the app level
         */
        this.ifSignedUp = () => !!_user?.bid;

        /**
         * Initialize the frontend & user data then connect to the back to update the session.
         * @return {Promise<void>}
         */
        this.init = async function () {
            try {
                _front = await initFront();
                _user = await initUser();
                if (_user?.bid) {
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

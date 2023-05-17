/**
 * A model for aggregating functionality related to user sessions.
 *
 * @namespace Fl32_Auth_Front_Mod_Session
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_Session {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Fl32_Auth_Shared_Web_Api_Session_Close} */
        const apiClose = spec['Fl32_Auth_Shared_Web_Api_Session_Close$'];
        /** @type {Fl32_Auth_Shared_Web_Api_Session_Init} */
        const apiInit = spec['Fl32_Auth_Shared_Web_Api_Session_Init$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        /**
         * Internal store to cache session data for established session.
         * @type {Object}
         */
        let _store;

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
         * Initialize established user session (load session data from backend).
         * @return {Promise<void>}
         */
        this.init = async function () {
            try {
                const req = apiInit.createReq();
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Session_Init.Response} */
                const res = await connApi.send(req, apiInit);
                if (res?.success) _store = res?.sessionData;
                else _store = undefined;
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
         * Set session data in this model on sign-in or sign-up.
         * @param {Object} data
         */
        this.setData = (data) => _store = data;
    }
}

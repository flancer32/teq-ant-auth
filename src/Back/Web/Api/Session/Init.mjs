/**
 * Initialize the session and fetch user data from the backend using the session ID stored in cookies.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Session_Init {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Shared_Web_Api_Session_Init} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Session_Init$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Session_Init.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Session_Init.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // load session data from HTTP request (see Fl32_Auth_Back_Web_Handler_Session)
            res.sessionData = modSess.getCachedData({request: context.request});
            res.success = Boolean(res.sessionData);
            logger.info(JSON.stringify(res));
        };
    }


}

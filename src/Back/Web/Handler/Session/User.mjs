/**
 * Web server handler to process requests to services (synchronous POST requests with JSON payloads).
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const {
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
} = H2;


// MODULE'S CLASSES
// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class Fl32_Auth_Back_Web_Handler_Session_User {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Back_Util_Cookie.get|function} cookieGet
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Web_Back_Util_Cookie.get': cookieGet,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }) {
        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf Fl32_Auth_Back_Web_Handler_Session_User
         *
         * TODO: do we really need sessions if we already have asymmetric encryption in place?
         */
        async function process(req, res) {
            // FUNCS

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                const httpSessionId = cookieGet({request: req, cookie: DEF.COOKIE_SESSION_FRONT_NAME});
                // read session cookie from the HTTP request
                const userSessionId = cookieGet({request: req, cookie: DEF.COOKIE_SESSION_USER_NAME});
                if (userSessionId) {
                    // store cookie ID in the request
                    await modSess.putId({request: req, sessionId: userSessionId});
                }
            }
        }

        // INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () { };

        this.canProcess = function ({method, address} = {}) {
            return (
                ((method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST))
                && (address?.space === DEF.SHARED.MOD_WEB_API.SPACE_SERVICE)
            );
        };
    }
}

/**
 * The web server handler to control and process session cookies.
 * This is just a trace mechanism for requests made by a single browser (front).
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import {randomUUID} from 'node:crypto';

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
export default class Fl32_Auth_Back_Web_Handler_Session_Front {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Mod_Session_Front} modFront
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Back_Mod_Session_Front$: modFront,
        }) {

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf Fl32_Auth_Back_Web_Handler_Session_Front
         */
        async function process(req, res) {
            // FUNCS

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                // read session cookie from the HTTP request
                let sessionId = modFront.cookieGet(req);
                if (!sessionId) {
                    sessionId = randomUUID();
                    modFront.cookieSet(res, sessionId);
                    logger.info(`New front session ID is generated: '${sessionId.substring(0, 8)}-...'.`);
                }
                // put the session ID into the HTTP request object
                req[DEF.REQ_HTTP_SESSION_FRONT_ID] = sessionId;
            }
        }

        // INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () { };

        this.canProcess = function ({method, address} = {}) {
            // we need HTTP sessions only for the Web API space
            return (
                ((method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST))
                && (address?.space === DEF.SHARED.MOD_WEB_API.SPACE_SERVICE)
            );
        };
    }
}

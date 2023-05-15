/**
 * Places a cookie with sessionID in the HTTP response.
 *
 * @namespace Fl32_Auth_Back_Act_Session_Plant
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Session_Plant';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {Fl32_Auth_Back_Defaults} */
    const DEF = spec['Fl32_Auth_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {TeqFw_Web_Back_Util_Cookie.create|function} */
    const cookieCreate = spec['TeqFw_Web_Back_Util_Cookie.create'];
    /** @type {TeqFw_Web_Back_Util_Cookie.set|function} */
    const cookieSet = spec['TeqFw_Web_Back_Util_Cookie.set'];
    /** @type {TeqFw_Web_Back_Mod_Address} */
    const mAddr = spec['TeqFw_Web_Back_Mod_Address$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Establish a new session for the given user.
     *
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
     * @param {string} sessionId
     * @return {void}
     * @memberOf Fl32_Auth_Back_Act_Session_Plant
     */
    function act({request, response, sessionId}) {
        // compose the session cookie and set it to the HTTP response
        const pathHttp = request.url;
        const parts = mAddr.parsePath(pathHttp);
        const path = (parts.root)
            ? (parts.door) ? `/${parts.root}/${parts.door}` : `/${parts.root}`
            : `/`;
        const cookie = cookieCreate({
            name: DEF.SESSION_COOKIE_NAME,
            value: sessionId,
            expires: DEF.SESSION_COOKIE_LIFETIME,
            path
        });
        cookieSet({response, cookie});
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
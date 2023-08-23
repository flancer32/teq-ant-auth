/**
 * Places a cookie with sessionID in the HTTP response.
 *
 * @namespace Fl32_Auth_Back_Act_Session_Plant
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Session_Plant';

// MODULE'S FUNCTIONS
/**
 * @param {Fl32_Auth_Back_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Web_Back_Util_Cookie.create|function} cookieCreate
 * @param {TeqFw_Web_Back_Util_Cookie.set|function} cookieSet
 * @param {TeqFw_Web_Back_Mod_Address} mAddr
 */
export default function (
    {
        Fl32_Auth_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$: logger,
        'TeqFw_Web_Back_Util_Cookie.create': cookieCreate,
        'TeqFw_Web_Back_Util_Cookie.set': cookieSet,
        TeqFw_Web_Back_Mod_Address$: mAddr,
    }) {
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
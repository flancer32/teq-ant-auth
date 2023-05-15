/**
 * Set HTTP header to clear session cookie.
 *
 * @namespace Fl32_Auth_Back_Act_Session_Clear
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Session_Clear';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {Fl32_Auth_Back_Defaults} */
    const DEF = spec['Fl32_Auth_Back_Defaults$'];
    /** @type {TeqFw_Web_Back_Util_Cookie.set|function} */
    const cookieSet = spec['TeqFw_Web_Back_Util_Cookie.set'];
    /** @type {TeqFw_Web_Back_Util_Cookie.clear|function} */
    const cookieClear = spec['TeqFw_Web_Back_Util_Cookie.clear'];
    /** @type {TeqFw_Web_Back_Mod_Address} */
    const mAddr = spec['TeqFw_Web_Back_Mod_Address$'];

    // FUNCS
    /**
     * Set HTTP header to clear session cookie.
     *
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
     * @return {void}
     * @memberOf Fl32_Auth_Back_Act_Session_Clear
     */
    function act({request, response}) {
        const pathHttp = request.url;
        const parts = mAddr.parsePath(pathHttp);
        const path = (parts.root)
            ? (parts.door) ? `/${parts.root}/${parts.door}` : `/${parts.root}`
            : `/`;
        const name = DEF.SESSION_COOKIE_NAME;
        const cookie = cookieClear({name, path});
        cookieSet({response, cookie});
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
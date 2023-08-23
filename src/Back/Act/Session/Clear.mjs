/**
 * Set HTTP header to clear session cookie.
 *
 * @namespace Fl32_Auth_Back_Act_Session_Clear
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Session_Clear';

// MODULE'S FUNCTIONS
/**
 * @param {Fl32_Auth_Back_Defaults} DEF
 * @param {TeqFw_Web_Back_Util_Cookie.set|function} cookieSet
 * @param {TeqFw_Web_Back_Util_Cookie.clear|function} cookieClear
 * @param {TeqFw_Web_Back_Mod_Address} mAddr
 */
export default function (
    {
        Fl32_Auth_Back_Defaults$: DEF,
        'TeqFw_Web_Back_Util_Cookie.set': cookieSet,
        'TeqFw_Web_Back_Util_Cookie.clear': cookieClear,
        TeqFw_Web_Back_Mod_Address$: mAddr,
    }) {
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
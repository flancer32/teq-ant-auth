/**
 * Process the front session cookies.
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Session_Front {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Util_Cookie} cookie
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Web_Back_Util_Cookie: cookie,
        }) {
        // VARS

        // FUNCS
        const {
            /** @type {function({name, path}):string} */
            clear: cookieClear,
            /** @type {function({name, value, path, expires, domain, secure, httpOnly, sameSite}):string} */
            create: cookieCreate,
            /** @type {function({request, cookie}):string|null} */
            get: cookieGet,
            /** @type {function({response, cookie}):void} */
            set: cookieSet,
        } = cookie;

        // INSTANCE METHODS
        /**
         * Extract the front session id from the HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @return {string|null}
         */
        this.cookieGet = function (request) {
            return cookieGet({request, cookie: DEF.COOKIE_SESSION_FRONT_NAME});
        };

        /**
         * Plant the front session id into HTTP response.
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @param {string} sessionId
         */
        this.cookieSet = function (response, sessionId) {
            const cookie = cookieCreate({
                httpOnly: true,
                name: DEF.COOKIE_SESSION_FRONT_NAME,
                path: '/',
                sameSite: 'Strict',
                secure: true,
                value: sessionId,
            });
            cookieSet({response, cookie});
        };

    }
}

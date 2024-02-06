/**
 * Encapsulate the functionality related to cookie processing to handle user sessions.
 */
// MODULE'S IMPORT
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Cookie {
    /**
     * @param {Fl32_Auth_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Util_Cookie} utilCookie
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Session} rdbSess
     * @param {TeqFw_Web_Back_Mod_Address} mAddr
     */
    constructor(
        {
            Fl32_Auth_Back_Defaults$: DEF,
            TeqFw_Web_Back_Util_Cookie: utilCookie,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Session$: rdbSess,
            TeqFw_Web_Back_Mod_Address$: mAddr,
        }
    ) {
        // VARS
        const A_SESS = rdbSess.getAttributes();

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
        } = utilCookie;

        // INSTANCE METHODS

        /**
         * Set HTTP header to clear session cookie.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @return {void}
         */
        this.clear = function ({request, response}) {
            const pathHttp = request.url;
            const parts = mAddr.parsePath(pathHttp);
            const path = (parts.root)
                ? (parts.door) ? `/${parts.root}/${parts.door}` : `/${parts.root}`
                : `/`;
            const name = DEF.COOKIE_SESSION_USER_NAME;
            const cookie = cookieClear({name, path});
            cookieSet({response, cookie});
        };

        /**
         * Generate new session code and create new record in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @param {number} frontBid
         * @return {Promise<{code: string}>}
         */
        this.create = async function ({trx, userBid, frontBid}) {
            let code, found;
            do {
                code = randomUUID();
                found = await crud.readOne(trx, rdbSess, {[A_SESS.CODE]: code});
            } while (found);
            const dto = rdbSess.createDto();
            dto.code = code;
            dto.user_ref = userBid;
            dto.front_ref = frontBid;
            await crud.create(trx, rdbSess, dto);
            return {code};
        };

        /**
         * Establish a new session for the given user.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} response
         * @param {string} sessionId
         * @return {void}
         */
        this.plant = function ({request, response, sessionId}) {
            // compose the session cookie and set it to the HTTP response
            const pathHttp = request.url;
            const parts = mAddr.parsePath(pathHttp);
            const path = (parts.root)
                ? (parts.door) ? `/${parts.root}/${parts.door}` : `/${parts.root}`
                : `/`;
            const cookie = cookieCreate({
                name: DEF.COOKIE_SESSION_USER_NAME,
                value: sessionId,
                expires: DEF.COOKIE_SESSION_USER_LIFETIME,
                path
            });
            cookieSet({response, cookie});
        };

    }
}

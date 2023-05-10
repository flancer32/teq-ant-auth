/**
 * This model allows getting/putting session data from/to an HTTP request. Every session has an ID and contains
 * app-specific data related to the session. The model uses an interface `Fl32_Auth_Back_Api_Session_Data` to load data
 * for the current session by its ID and stores this data internally (in the HTTP request or internal cache).
 */
// MODULE'S VARS

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Session_Store {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Auth_Back_Defaults} */
        const DEF = spec['Fl32_Auth_Back_Defaults$'];
        /** @type {Fl32_Auth_Back_Api_Session_Data} */
        const modData = spec['Fl32_Auth_Back_Api_Session_Data$'];

        // VARS

        // INSTANCE METHODS

        /**
         * Clear session data related to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         */
        this.clearData = function (request) {
            const sessionId = this.getId(request);
            if (sessionId) return modData.get(sessionId);
        };

        /**
         * Get session data related to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @returns {*} session data
         */
        this.getData = function (request) {
            const sessionId = this.getId(request);
            if (sessionId) return modData.get(sessionId);
            else return null;
        };

        /**
         * Get session data from an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @returns {string} sessionId
         */
        this.getId = function (request) {
            return request[DEF.REQ_HTTP_SESS_ID];
        };

        /**
         * Save session ID to an HTTP request.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} request
         * @param {string} sessionId
         * @returns {Promise<void>}
         */
        this.putId = async function (request, sessionId) {
            request[DEF.REQ_HTTP_SESS_ID] = sessionId;
            await modData.load(sessionId);
        };

    }
}

/**
 * A model for aggregating functionality related to user authentication using passwords.
 * All binary values (salts, hashes, random values, etc.) are converted to HEX strings for input/output
 * (parameters and results).
 *
 * @namespace Fl32_Auth_Front_Mod_Password
 */

// MODULE'S VARS
const ALG = 'SHA-384';

// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_Password {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Util_Codec.binToHex|function} binToHex
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read} apiSaltRead
     * @param {Fl32_Auth_Shared_Web_Api_Password_Validate} apiValid
     * @param {Fl32_Auth_Front_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Core_Shared_Util_Codec.binToHex': binToHex,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_Password_Salt_Read$: apiSaltRead,
            Fl32_Auth_Shared_Web_Api_Password_Validate$: apiValid,
            // Fl32_Auth_Front_Mod_Session$: modSess, // TODO circular dependency here
        }
    ) {

        // MAIN
        logger.setNamespace(this.constructor.name);
        const encoder = new TextEncoder();

        // FUNCS

        // INSTANCE METHODS

        /**
         * Create SHA hash for `password` using `salt` and encode as HEX string.
         *
         * @param {string} password plain password
         * @param {string} salt HEX string representation of a salt
         * @returns {Promise<string>} HEX string representation of the SHA-256 hash
         */
        this.hashCompose = async function (password, salt) {
            const data = encoder.encode(`${salt}${password}`);
            const hash = await crypto.subtle.digest(ALG, data);
            return binToHex(hash);
        };

        /**
         * Creates password hash using salt from backend and validates the user's password on the backend.
         * @param {*} userRef - App-specific identifier for the user.
         * @param {string} password - The plain password.
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Password_Validate.Response>}
         */
        this.passwordValidate = async function (userRef, password) {
            try {
                // retrieve the password salt and compose the password's hash
                const salt = await this.saltRead(userRef);
                const hash = await this.hashCompose(password, salt);
                //
                const req = apiValid.createReq();
                req.passwordHash = hash;
                req.userRef = userRef;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Password_Validate.Response} */
                const res = await connApi.send(req, apiValid);
                // set session data to the session model
                if (res?.success) modSess.setData(res?.sessionData);
                return res;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot validate user password. Error: ${e?.message}`);
            }
        };

        /**
         * Generate random binary and encode it as HEX string.
         * @param {number} bytes number of bytes in random binary
         * @return {string}
         */
        this.saltNew = function (bytes) {
            const bin = new Uint8Array(bytes);
            window.crypto.getRandomValues(bin);
            return binToHex(bin);
        };

        /**
         * Reads the password salt for the given user from the backend.
         * @param {*} userRef - Application-specific identifier for the user (email, login, UUID, etc.).
         * @return {Promise<string>} HEX string representation of binary values
         */
        this.saltRead = async function (userRef) {
            try {
                const req = apiSaltRead.createReq();
                req.userRef = userRef;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Response} */
                const res = await connApi.send(req, apiSaltRead);
                if (res?.salt) return res?.salt;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot initialize user session. Error: ${e?.message}`);
            }
        };
    }
}

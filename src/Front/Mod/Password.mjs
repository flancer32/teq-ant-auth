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
     * @param {Fl32_Auth_Front_Util_Codec} codec
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read} apiSaltRead
     * @param {Fl32_Auth_Shared_Web_Api_Password_Validate} apiValid
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Front_Util_Codec$: codec,
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
         * Create SHA hash for `password` using `salt` and encode the result as a 'base64url' string.
         *
         * @param {string} password - the plain password
         * @param {string} salt - the 'base64url' representation of a salt
         * @returns {Promise<string>} - the 'base64url' representation of the SHA-256 hash
         */
        this.hashCompose = async function (password, salt) {
            const saltBin = codec.b64UrlToBin(salt);
            const passwordBin = encoder.encode(password);
            const totalLength = saltBin.length + passwordBin.length;
            const data = new Uint8Array(totalLength);
            data.set(saltBin, 0);
            data.set(passwordBin, saltBin.length);
            const hash = await crypto.subtle.digest(ALG, data);
            return codec.binToB64Url(hash);
        };

        /**
         * Creates password hash using salt from backend and validates the user's password on the backend.
         * @param {*} userRef - App-specific identifier for the user.
         * @param {string} frontUuid - The front UUID to bind with user in the authenticated session on the back.
         * @param {string} password - The plain password.
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Password_Validate.Response>}
         */
        this.passwordValidate = async function (userRef, frontUuid, password) {
            try {
                // retrieve the password salt and compose the password's hash
                const salt = await this.saltRead(userRef);
                const hash = await this.hashCompose(password, salt);
                //
                const req = apiValid.createReq();
                req.frontUuid = frontUuid;
                req.passwordHash = hash;
                req.userRef = userRef;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Password_Validate.Response} */
                return await connApi.send(req, apiValid);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot validate user password. Error: ${e?.message}`);
            }
        };

        /**
         * Generate random binary and encode it as HEX string.
         * @param {number} bytes - the number of bytes in a random binary
         * @return {string} - the 'base64url' representation of th salt
         */
        this.saltNew = function (bytes) {
            const bin = new Uint8Array(bytes);
            window.crypto.getRandomValues(bin);
            return codec.binToB64Url(bin);
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

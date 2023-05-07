/**
 * A model to aggregate functionality related to user authentication with password.
 * @namespace Fl32_Auth_Front_Mod_Password
 */
// MODULE'S VARS
const ALG = 'SHA-384';

// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_Password {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Codec.binToHex|function} */
        const binToHex = spec['TeqFw_Core_Shared_Util_Codec.binToHex'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        const encoder = new TextEncoder();

        // FUNCS

        // INSTANCE METHODS

        /**
         * Create SHA-256 hash for `password` using `salt` and encode as HEX string.
         *
         * @param {string} password plain password
         * @param {string} salt
         * @returns {Promise<string>}
         */
        this.hash = async function (password, salt) {
            const data = encoder.encode(`${salt}${password}`);
            const hash = await crypto.subtle.digest(ALG, data);
            return binToHex(hash);
        };

        /**
         * Generate random binary and encode it as HEX string.
         * @param {number} bytes number of bytes in random binary
         * @return {string}
         */
        this.salt = function (bytes) {
            const bin = new Uint8Array(bytes);
            window.crypto.getRandomValues(bin);
            return binToHex(bin);
        };
    }
}

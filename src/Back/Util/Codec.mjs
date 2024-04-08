/**
 * Encoding/decoding utilities for strings and binary data that are used in the current plugin.
 */
export default class Fl32_Auth_Back_Util_Codec {
    /**
     * Convert base64url encoded data to binary.
     * @param {string} data
     * @returns {Buffer}
     * @memberOf Fl32_Auth_Back_Util_Codec
     */
    b64UrlToBin(data) {
        // Convert base64url string to regular base64 string
        const b64 = data.replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '=');
        return this.base64ToBin(padded);
    }

    /**
     * Convert base64 encoded data to base64url encoded data.
     * @param {string} base64
     * @returns {string}
     * @memberOf Fl32_Auth_Back_Util_Codec
     */
    base64ToB64Url(base64) {
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
     * Convert base64 encoded data to binary.
     * @param {string} data
     * @returns {Buffer}
     * @memberOf Fl32_Auth_Back_Util_Codec
     */
    base64ToBin(data) {
        return Buffer.from(data, 'base64');
    }

    /**
     * Convert binary data to base64 url encoded string.
     * @param {Buffer|Uint8Array} data
     * @returns {string}
     * @memberOf Fl32_Auth_Back_Util_Codec
     */
    binToB64Url(data) {
        const buf = (data instanceof Buffer) ? data : Buffer.from(data);
        const b64 = buf.toString('base64');
        return this.base64ToB64Url(b64);
    };
}

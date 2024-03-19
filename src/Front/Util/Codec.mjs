/**
 * Encoding/decoding utilities for strings and binary data.
 */
export default class Fl32_Auth_Front_Util_Codec {
    /**
     * Convert base64url string to binary.
     * @param {string} data
     * @returns {Uint8Array}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    b64UrlToBin(data) {
        const base64 = this.b64UrlToBase64(data);
        return this.base64ToBin(base64);
    }

    /**
     * Convert base64url string to regular base64 string
     * @param {string} data
     * @returns {string}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    b64UrlToBase64(data) {
        const buf = data.replace(/-/g, '+').replace(/_/g, '/');
        return buf.padEnd(buf.length + (4 - buf.length % 4) % 4, '=');
    }

    /**
     * Convert base64 encoded data to binary.
     * @param {string} data
     * @returns {Uint8Array}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    base64ToBin(data) {
        return new Uint8Array([...atob(data)].map(c => c.charCodeAt(0)));
    }

    /**
     * Convert base64 encoded data to base64url encoded data.
     * @param {string} base64
     * @returns {string}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    base64ToB64Url(base64) {
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
     * Convert binary data to base64 string.
     * @param {ArrayBuffer} data
     * @returns {string}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    binToBase64(data) {
        const binaryArray = new Uint8Array(data);
        return btoa(String.fromCharCode.apply(null, binaryArray));
    }

    /**
     * Convert binary data to base64url string.
     * @param {ArrayBuffer} data
     * @returns {string}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    binToB64Url(data) {
        const buf = this.binToBase64(data);
        return this.base64ToB64Url(buf);
    }

    /**
     * Convert JSON data encoded as a binary to JS Object.
     * @param {ArrayBuffer} data
     * @returns {Object}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    binToJson(data) {
        const jsonString = this.binToUtf8(data);
        return JSON.parse(jsonString);
    }

    /**
     * Convert UTF8 string encoded as a binary to string.
     * @param {ArrayBuffer} data
     * @returns {String}
     * @memberOf Fl32_Auth_Front_Util_Codec
     */
    binToUtf8(data) {
        return new TextDecoder('utf-8').decode(data);
    }
}
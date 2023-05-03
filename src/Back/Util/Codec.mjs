/**
 * Encoding/decoding utilities for strings and binary data.
 * @namespace Fl32_Auth_Back_Util_Codec
 */
// DEFINE WORKING VARS
const NS = 'Fl32_Auth_Back_Util_Codec';

/**
 * Convert base64url encoded data to binary.
 * @param {string} data
 * @returns {Buffer}
 * @memberOf Fl32_Auth_Back_Util_Codec
 */
function b64UrlToBin(data) {
    // Convert base64url string to regular base64 string
    const b64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '=');
    return base64ToBin(padded);
}

/**
 * Convert base64 encoded data to base64url encoded data.
 * @param {string} base64
 * @returns {string}
 * @memberOf Fl32_Auth_Back_Util_Codec
 */
function base64ToB64Url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Convert base64 encoded data to binary.
 * @param {string} data
 * @returns {Buffer}
 * @memberOf Fl32_Auth_Back_Util_Codec
 */
function base64ToBin(data) {
    return Buffer.from(data, 'base64');
}

/**
 * Convert binary data to base64 url encoded string.
 * @param {Buffer} data
 * @returns {string}
 * @memberOf Fl32_Auth_Back_Util_Codec
 */
function binToB64Url(data) {
    const b64 = data.toString('base64');
    return base64ToB64Url(b64);
}

// finalize code components for this es6-module
Object.defineProperty(b64UrlToBin, 'namespace', {value: NS});
Object.defineProperty(base64ToB64Url, 'namespace', {value: NS});
Object.defineProperty(base64ToBin, 'namespace', {value: NS});
Object.defineProperty(binToB64Url, 'namespace', {value: NS});

export {
    b64UrlToBin,
    base64ToB64Url,
    base64ToBin,
    binToB64Url,
}

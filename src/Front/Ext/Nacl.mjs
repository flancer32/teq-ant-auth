/**
 * Wrapper for 'tweetnacl' npm-package (commonJS).
 *
 * Statics mapping for web server see in './teqfw.json'.
 * All frontend imports are related to this es6-module.
 *
 * @namespace Fl32_Auth_Front_Ext_Nacl
 */
// MODULE'S IMPORT
import * as unused from '../../../../tweetnacl/nacl-fast.min.js'; // just load CommonJS module to browser
const t = unused; // prevent the `import` optimization in IDE

// MODULE'S MAIN

/**
 * @typedef {Object} BoxKeyPair
 * @property {Uint8Array} publicKey - The public key for Box encryption.
 * @property {Uint8Array} secretKey - The secret key for Box encryption.
 */

/**
 * @typedef {Object} SignKeyPair
 * @property {Uint8Array} publicKey - The public key for digital signatures.
 * @property {Uint8Array} secretKey - The secret key for digital signatures.
 */

/**
 * @namespace
 * @property {Object} nacl - The NaCl library.
 * @property {function(): BoxKeyPair} nacl.box.keyPair - Generates a key pair for Box encryption.
 * @property {function(): SignKeyPair} nacl.sign.keyPair - Generates a key pair for digital signatures.
 * @property {function(data: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array} nacl.box - Encrypts a message using Box encryption.
 * @property {function(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array} nacl.secretbox - Encrypts a message using secret-key cryptography.
 * @property {function(data: Uint8Array, secretKey: Uint8Array): Uint8Array} nacl.sign - Signs a message using digital signatures.
 * @property {function(): Uint8Array} nacl.randomBytes - Generates random bytes.
 */

// MODULE'S MAIN
// decompose the stuff from 'window' object to add JSDoc
const {
    /**
     * @type {Object}
     * @property {function(): BoxKeyPair} box.keyPair - Generates a key pair for Box encryption.
     * @property {function(data: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array): Uint8Array} box - Encrypts a message using Box encryption.
     */
    box,

    /**
     * @type {function(): Uint8Array}
     */
    randomBytes,

    /**
     * @type {Object}
     * @property {function(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array} secretbox - Encrypts a message using secret-key cryptography.
     */
    secretbox,

    /**
     * @type {Object}
     * @property {function(): SignKeyPair} sign.keyPair - Generates a key pair for digital signatures.
     * @property {function(data: Uint8Array, secretKey: Uint8Array): Uint8Array} sign - Signs a message using digital signatures.
     */
    sign,
} = window.nacl;

const Fl32_Auth_Front_Ext_Nacl = {
    box,
    randomBytes,
    secretbox,
    sign,
};

export default Fl32_Auth_Front_Ext_Nacl;
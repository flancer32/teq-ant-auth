/**
 * Interface for scrambler object to encrypt/decrypt and sign/verify the string data.
 *
 * There are different cryptographic libraries and algorithms, so this interface defines
 * base principles for crypto keys usage in the app (both for back & front).
 *
 * @interface
 * TODO: move asymmetric keys encryption to the separate plugin
 */
export default class Fl32_Auth_Shared_Api_Crypto_Scrambler {

    /**
     * @param {string} encrypted
     * @return {string}
     */
    decryptAndVerify(encrypted) {}

    /**
     * @param {string} plain
     * @return {string}
     */
    encryptAndSign(plain) {}

    /**
     * Set public and secret keys to encrypt/decrypt messages.
     * @param {string} pub - base64 encoded public key (their)
     * @param {string} sec - base64 encoded secret key (own)
     * TODO: set encrypt & sign keys separately
     */
    setKeys(pub, sec) {}

    /**
     * Signs the text message.
     * @param {string} message
     * @param {string} sec - the base64 encoded secret key to sign
     */
    sign(message, sec) {}

    /**
     * Verifies the signature and gets the signed data as text.
     * @param {string} signed - The base64 encoded signed text.
     * @param {string} pub - The base64 encoded public key to verify signatures.
     * @return {string|null} - The verified signed data as text, or null if verification fails.
     */
    verify(signed, pub) { }

}

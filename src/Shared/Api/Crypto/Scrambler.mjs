/**
 * Interface for scrambler object to encrypt/decrypt string data.
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
     * @param {string} pub base64 encoded public key (their)
     * @param {string} sec base64 encoded secret key (own)
     */
    setKeys(pub, sec) {}
}

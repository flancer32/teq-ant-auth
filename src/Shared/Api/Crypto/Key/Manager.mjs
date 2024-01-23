/**
 * Interface for cryptographic keys manager.
 *
 * There are different cryptographic libraries and algorithms, so this interface defines
 * base principles for crypto keys usage in the app (both for back & front).
 *
 * @interface
 */
export default class Fl32_Auth_Shared_Api_Crypto_Key_Manager {

    /**
     * Generate keys pair for asynchronous encryption.
     * Both keys in result  are base64 encoded strings.
     * @return {Promise<Fl32_Auth_Shared_Dto_Crypto_Keys.Dto>}
     */
    async createKeysToEncrypt() {}

    /**
     * Generate keys pair to sign/verify data.
     * Both keys in result  are base64 encoded strings.
     * @return {Promise<Fl32_Auth_Shared_Dto_Crypto_Keys.Dto>}
     */
    async createKeysToSign() {}

    /**
     * Generate key for synchronous encryption.
     * @return {Promise<string>} base64 encoded key.
     */
    async generateSecretKey() { }
}

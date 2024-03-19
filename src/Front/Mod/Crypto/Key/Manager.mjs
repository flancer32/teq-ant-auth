/**
 * Key manager to generate keys, import/export keys, etc.
 * @implements Fl32_Auth_Shared_Api_Crypto_Key_Manager
 */
export default class Fl32_Auth_Front_Mod_Crypto_Key_Manager {
    /**
     * @param {Fl32_Auth_Front_Ext_Nacl} extNacl
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     * @param {Fl32_Auth_Shared_Dto_Crypto_Keys} dtoKeys
     */
    constructor(
        {
            Fl32_Auth_Front_Ext_Nacl$AS: extNacl,
            TeqFw_Core_Shared_Api_Util_Codec$: util,
            Fl32_Auth_Shared_Dto_Crypto_Keys$: dtoKeys,
        }
    ) {
        // FUNCS
        const {
            box,
            randomBytes,
            secretBox,
            sign,
        } = extNacl;

        // INSTANCE METHODS

        this.createKeysToEncrypt = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = box.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        };

        this.createKeysToSign = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = sign.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        };

        this.generateSecretKey = async function () {
            //return util.ab2b64(randomBytes(secretBox.keyLength));
        }
    }
}

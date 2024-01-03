/**
 * Key manager to generate keys, import/export keys, etc.
 * @implements Fl32_Auth_Shared_Api_Crypto_Key_Manager
 */
export default class Fl32_Auth_Front_Mod_Crypto_Key_Manager {
    /**
     * @param {Fl32_Auth_Front_Ext_Nacl.box|function} box
     * @param {Fl32_Auth_Front_Ext_Nacl.secretbox|function} secretBox
     * @param {Fl32_Auth_Front_Ext_Nacl.randomBytes|function} randomBytes
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     * @param {Fl32_Auth_Shared_Dto_Identity_Keys} dtoKeys
     */
    constructor(
        {
            'Fl32_Auth_Front_Ext_Nacl.box': box,
            'Fl32_Auth_Front_Ext_Nacl.secretbox': secretBox,
            'Fl32_Auth_Front_Ext_Nacl.randomBytes': randomBytes,
            TeqFw_Core_Shared_Api_Util_Codec$: util,
            Fl32_Auth_Shared_Dto_Identity_Keys$: dtoKeys,
        }
    ) {
        // INSTANCE METHODS

        this.generateAsyncKeys = async function () {
            const res = dtoKeys.createDto();
            const keysBuf = box.keyPair();
            res.secret = util.ab2b64(keysBuf.secretKey);
            res.public = util.ab2b64(keysBuf.publicKey);
            return res;
        };

        this.generateSecretKey = async function () {
            //return util.ab2b64(randomBytes(secretBox.keyLength));
        }
    }
}

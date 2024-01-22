/**
 * Frontend implementation for scrambler (encrypt/decrypt, sign/verify operations for strings).
 *
 * @implements Fl32_Auth_Shared_Api_Crypto_Scrambler
 */
export default class Fl32_Auth_Front_Mod_Crypto_Scrambler {
    /**
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     * @param {Fl32_Auth_Front_Ext_Nacl} nacl
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Util_Codec$: util,
            Fl32_Auth_Front_Ext_Nacl: nacl,
        }
    ) {
        // VARS
        // FUNCS
        const {sign} = nacl;

        // INSTANCE METHODS
        this.decryptAndVerify = function (encrypted) {};

        this.encryptAndSign = function (plain) {};

        this.setKeys = function (pub, sec) {};

        this.sign = function (message, sec) {
            const secret = util.b642ab(sec);
            const msgBin = util.utf2ab(message);
            const signBin = sign(msgBin, secret);
            return util.ab2b64(signBin);
        };
    }
}

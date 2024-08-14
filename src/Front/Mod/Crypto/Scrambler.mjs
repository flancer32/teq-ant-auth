/**
 * Frontend implementation for scrambler (encrypt/decrypt, sign/verify operations for strings).
 *
 * @implements Fl32_Auth_Shared_Api_Crypto_Scrambler
 */
export default class Fl32_Auth_Front_Mod_Crypto_Scrambler {
    /**
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     * @param {Fl32_Auth_Front_Ext_Nacl} extNacl
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Util_Codec$: util,
            'Fl32_Auth_Front_Ext_Nacl.default': extNacl,
        }
    ) {
        // VARS
        let _keyShared;

        // FUNCS
        const {box, randomBytes, sign} = extNacl;

        // INSTANCE METHODS
        this.decryptAndVerify = function (encrypted) {
            let res;
            const messageWithNonceAsUint8Array = util.b642ab(encrypted);
            const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
            const message = messageWithNonceAsUint8Array.slice(
                box.nonceLength,
                encrypted.length
            );
            const decryptedAb = box.open.after(message, nonce, _keyShared);
            if (decryptedAb) {
                const jsonStr = util.ab2utf(decryptedAb);
                res = JSON.parse(jsonStr);
            }
            return res;
        };

        this.encryptAndSign = function (plain) {
            const messageUint8 = util.utf2ab(JSON.stringify(plain));
            const nonce = randomBytes(box.nonceLength);
            const encrypted = box.after(messageUint8, nonce, _keyShared);
            const fullMessage = new Uint8Array(nonce.length + encrypted.length);
            fullMessage.set(nonce);
            fullMessage.set(encrypted, nonce.length);
            return util.ab2b64(fullMessage);
        };

        this.setKeys = function (pub, sec) {
            const abPub = util.b642ab(pub);
            const abSec = util.b642ab(sec);
            _keyShared = box.before(abPub, abSec);
        };

        this.sign = function (message, sec) {
            const secret = util.b642ab(sec);
            const msgBin = util.utf2ab(message);
            const signBin = sign(msgBin, secret);
            return util.ab2b64(signBin);
        };
    }

    verify(signed, pub) {
        return undefined;
    }
}

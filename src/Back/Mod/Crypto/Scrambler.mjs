/**
 * Backend implementation for scrambler (encrypt/decrypt, sign/verify operations for strings).
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module

// MODULE'S CLASSES
/**
 * @implements Fl32_Auth_Shared_Api_Crypto_Scrambler
 */
export default class Fl32_Auth_Back_Mod_Crypto_Scrambler {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Api_Util_Codec} util
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Shared_Api_Util_Codec$: util,
        }
    ) {
        // VARS

        // FUNCS
        const {sign} = nacl;

        // INSTANCE METHODS


        this.verify = function (signed, pub) {
            let res = null;
            try {
                const textBin = util.b642ab(signed);
                const pubBin = util.b642ab(pub);
                const resBin = sign.open(textBin, pubBin);
                res = util.ab2utf(resBin);
            } catch (e) {
                logger.error(`Cannot verify the signature: ${e}`);
            }
            return res;
        };


    }
}

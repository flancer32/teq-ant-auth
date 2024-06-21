/**
 * A model for aggregating functionality related to user authentication using passwords.
 * All binary values (salts, hashes, random values, etc.) are converted to base64url strings for input/output
 * (parameters and results).
 *
 * @namespace Fl32_Auth_Front_Mod_Password
 */

// MODULE'S VARS
const ALG = 'SHA-384';

// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_Password {
    /**
     * @param {Fl32_Auth_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Front_Util_Codec} codec
     * @param {TeqFw_Web_Api_Front_Web_Connect} api
     * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read} endSaltRead
     * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Check} endResetCheck
     * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Init} endResetInit
     * @param {Fl32_Auth_Shared_Web_Api_Password_Reset_Replace} endResetReplace
     * @param {Fl32_Auth_Shared_Web_Api_Password_Validate} endValid
     * @param {Fl32_Auth_Shared_Web_Api_Email_Check} endEmailCheck
     */
    constructor(
        {
            Fl32_Auth_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Front_Util_Codec$: codec,
            TeqFw_Web_Api_Front_Web_Connect$: api,
            Fl32_Auth_Shared_Web_Api_Password_Salt_Read$: endSaltRead,
            Fl32_Auth_Shared_Web_Api_Password_Reset_Check$: endResetCheck,
            Fl32_Auth_Shared_Web_Api_Password_Reset_Init$: endResetInit,
            Fl32_Auth_Shared_Web_Api_Password_Reset_Replace$: endResetReplace,
            Fl32_Auth_Shared_Web_Api_Password_Validate$: endValid,
            Fl32_Auth_Shared_Web_Api_Email_Check$: endEmailCheck,
            // Fl32_Auth_Front_Mod_Session$: modSess, // TODO circular dependency here
        }
    ) {

        // VARS
        const encoder = new TextEncoder();

        // INSTANCE METHODS

        /**
         * Create SHA hash for `password` using `salt` and encode the result as a 'base64url' string.
         *
         * @param {string} password - the plain password
         * @param {string} salt - the 'base64url' representation of a salt
         * @returns {Promise<string>} - the 'base64url' representation of the SHA-256 hash
         */
        this.hashCompose = async function (password, salt) {
            const saltBin = codec.b64UrlToBin(salt);
            const passwordBin = encoder.encode(password);
            const totalLength = saltBin.length + passwordBin.length;
            const data = new Uint8Array(totalLength);
            data.set(saltBin, 0);
            data.set(passwordBin, saltBin.length);
            const hash = await crypto.subtle.digest(ALG, data);
            return codec.binToB64Url(hash);
        };

        /**
         * Check the existence of the given email on the back.
         * @param {string} email
         * @return {Promise<boolean>}
         */
        this.isEmailUnique = async function ({email}) {
            try {
                const req = endEmailCheck.createReq();
                req.email = email;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Email_Check.Response} */
                const res = await api.send(req, endEmailCheck);
                return res?.isUnique;
            } catch (e) {
                logger.exception(e);
            }
        };

        /**
         * Creates password hash using salt from backend and validates the user's password on the backend.
         * @param {*} userRef - App-specific identifier for the user.
         * @param {Fl32_Auth_Front_Dto_Front.Dto} front - The front to register on the back if password is valid.
         * @param {string} password - The plain password.
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Password_Validate.Response>}
         */
        this.passwordValidate = async function (userRef, front, password) {
            try {
                // retrieve the password salt and compose the password's hash
                const salt = await this.saltRead(userRef);
                const hash = await this.hashCompose(password, salt);
                //
                const req = endValid.createReq();
                req.frontUuid = front.frontUuid;
                req.frontKeyEncrypt = front.keysEncrypt.public;
                req.frontKeyVerify = front.keysSign.public;
                req.passwordHash = hash;
                req.userRef = userRef;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Password_Validate.Response} */
                return await api.send(req, endValid);
            } catch (e) {
                logger.exception(e);
            }
        };

        /**
         * Check the code existence and lLoad the user data to set the new password.
         * @param {string} code
         * @return {Promise<Fl32_Auth_Shared_Web_Api_Password_Reset_Check.Response>}
         */
        this.resetCheck = async function (code) {
            try {
                const req = endResetCheck.createReq();
                req.code = code;
                return await api.send(req, endResetCheck);
            } catch (e) {
                logger.exception(e);
            }
        };

        /**
         * Request the back to send email with reset link.
         * @param {string} email
         * @return {Promise<boolean>}
         */
        this.resetInit = async function (email) {
            try {
                const req = endResetInit.createReq();
                req.email = email;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Password_Reset_Init.Response} */
                const rs = await api.send(req, endResetInit);
                return rs?.success;
            } catch (e) {
                logger.exception(e);
            }
        };

        /**
         * Replace the current password with a new one.
         * @param {string} code
         * @param {string} password - the plain password
         * @param {Fl32_Auth_Front_Dto_User.Dto} user
         * @param {Fl32_Auth_Front_Dto_Front.Dto} front - The front to establish a new session on the back if password is replaced.
         * @return {Promise<Fl32_Auth_Shared_Web_Api_Password_Reset_Replace.Response>}
         */
        this.resetReplace = async function (code, password, user, front) {
            try {
                const req = endResetReplace.createReq();
                req.code = code;
                req.frontKeyEncrypt = front.keysEncrypt.public;
                req.frontKeyVerify = front.keysSign.public;
                req.frontUuid = front.frontUuid;
                req.keyEncrypt = user.keysEncrypt.public;
                req.keyVerify = user.keysSign.public;
                req.passwordSalt = this.saltNew(DEF.SALT_BYTES);
                req.passwordHash = await this.hashCompose(password, req.passwordSalt);
                return await api.send(req, endResetReplace);
            } catch (e) {
                logger.exception(e);
            }
        };

        /**
         * Generate random binary and encode it as base64url string.
         * @param {number} [bytes] - the number of bytes in a random binary
         * @return {string} - the 'base64url' representation of th salt
         */
        this.saltNew = function (bytes) {
            const bin = new Uint8Array(bytes ?? DEF.SALT_BYTES);
            window.crypto.getRandomValues(bin);
            return codec.binToB64Url(bin);
        };

        /**
         * Reads the password salt for the given user from the backend.
         * @param {*} userRef - Application-specific identifier for the user (email, login, UUID, etc.).
         * @return {Promise<string>} base64url string representation of binary values
         */
        this.saltRead = async function (userRef) {
            try {
                const req = endSaltRead.createReq();
                req.userRef = userRef;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Response} */
                const res = await api.send(req, endSaltRead);
                if (res?.salt) return res?.salt;
            } catch (e) {
                logger.exception(e);
            }
        };
    }
}

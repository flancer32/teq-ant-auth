/**
 * The password authentication model.
 */
// MODULE'S IMPORTS
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Password {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Util_Codec} codec
     * @param {Fl32_Auth_Back_Act_Password_Validate.act|function} actPassValid
     * @param {Fl32_Auth_Back_Api_Mod_User} modUser
     * @param {TeqFw_Core_Back_Util_Cast.castBuffer|function} castBuffer
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Back_Util_Codec$: codec,
            Fl32_Auth_Back_Act_Password_Validate$: actPassValid,
            Fl32_Auth_Back_Api_Mod_User$: modUser,
            'TeqFw_Core_Back_Util_Cast.castBuffer': castBuffer,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
        }
    ) {
        // VARS
        const A_PASS = rdbPass.getAttributes();

        // INSTANCE METHODS
        /**
         * Create a new password record for the given user.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid - the reference to the existing user
         * @param {string} email - the email to restore password
         * @param {string} [hash] - the base64 encoded binary
         * @param {string} [salt] - the base64 encoded binary
         * @return {Promise<Object>}
         */
        this.create = async function ({trx, userBid, email, hash, salt}) {
            const dto = rdbPass.createDto();
            dto.user_ref = userBid;
            dto.email = email;
            if (hash) {
                const binHash = codec.b64UrlToBin(hash);
                dto.hash = castBuffer(binHash);
            }
            if (salt) {
                const binSalt = codec.b64UrlToBin(salt);
                dto.salt = castBuffer(binSalt);
            }
            return await crud.create(trx, rdbPass, dto);
        };
        /**
         * Read the password salt for the given user.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @return {Promise<{b64url:string, bin:Buffer}>}
         */
        this.readSalt = async function ({trx, userBid}) {
            let b64url, bin;
            /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
            const found = await crud.readOne(trx, rdbPass, userBid);
            if (found?.salt) {
                bin = found.salt;
                b64url = codec.binToB64Url(found.salt);
            }
            return {b64url, bin};
        };

        /**
         * List all records by given email.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} email
         * @return {Promise<Fl32_Auth_Back_RDb_Schema_Password.Dto[]>}
         */
        this.listByEmail = async function ({trx, email}) {
            const where = {[A_PASS.EMAIL]: email.toLowerCase().trim()};
            return await crud.readSet(trx, rdbPass, where);
        };

        /**
         * Set the new password data (hash and salt) for the user.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @param {string} hash - the base64 encoded binary
         * @param {string} salt - the base64 encoded binary
         * @return {Promise<number>}
         */
        this.update = async function ({trx, userBid, hash, salt}) {
            const dto = rdbPass.createDto();
            const binHash = codec.b64UrlToBin(hash);
            const binSalt = codec.b64UrlToBin(salt);
            dto.user_ref = userBid;
            dto.hash = castBuffer(binHash);
            dto.salt = castBuffer(binSalt);
            return await crud.updateOne(trx, rdbPass, dto);
        };

        /**
         * Load user data by user reference and validate password's hash.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} [userBid] - the backend ID for the user
         * @param {*} [userRef] - the app-specific identifier for the user (email, uuid, ...).
         * @param {string} hash  - the representation of the password hash as 'base64url' string.
         * @return {Promise<{success: boolean, userBid:number}>}
         */
        this.validateHash = async function ({trx, userBid, userRef, hash}) {
            let bid = userBid;
            if (!bid) {
                const {bid: foundBid} = await modUser.userRead({trx, userRef});
                bid = foundBid;
            }
            const {success} = await actPassValid({trx, userBid: bid, hash});
            return {success, userBid: bid};
        };

    }
}

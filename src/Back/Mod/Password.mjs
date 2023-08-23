/**
 * Password authentication model.
 */
// MODULE'S IMPORTS
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Password {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Act_Password_Validate.act|function} actPassValid
     * @param {Fl32_Auth_Back_Api_Mole} moleApp
     * @param {TeqFw_Core_Back_Util_Cast.castBuffer|function} castBuffer
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Password} rdbPass
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Back_Act_Password_Validate$: actPassValid,
            Fl32_Auth_Back_Api_Mole$: moleApp,
            'TeqFw_Core_Back_Util_Cast.castBuffer': castBuffer,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Password$: rdbPass,
        }) {
        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS
        /**
         * Save new password data (hash and salt) for the user into RDB.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @param {Buffer|Uint8Array} hash
         * @param {Buffer|Uint8Array} salt
         * @return {Promise<void>}
         */
        this.create = async function ({trx, userBid, hash, salt}) {
            const dto = rdbPass.createDto();
            dto.user_ref = userBid;
            dto.hash = castBuffer(hash);
            dto.salt = castBuffer(salt);
            await crud.create(trx, rdbPass, dto);
        };

        /**
         * Load user data by user reference and validate password's hash.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} userRef - App-specific identifier for the user (email, uuid, ...).
         * @param {string} hashHex - HEX string representation of the password's hash (binary).
         * @return {Promise<{success: boolean, userBid:number}>}
         */
        this.validateHash = async function ({trx, userRef, hashHex}) {
            const {userBid} = await moleApp.userRead({trx, userRef});
            const {success} = await actPassValid({trx, userBid, hashHex});
            return {success, userBid};
        };

    }
}

/**
 * The password authentication model.
 */
// MODULE'S IMPORTS
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Password {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Act_Password_Validate} actPassValid
     * @param {Fl32_Auth_Back_Api_Mod_User} modUser
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Password} rdbPass
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Password_Reset} rdbReset
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Back_Act_Password_Validate$: actPassValid,
            Fl32_Auth_Back_Api_Mod_User$: modUser,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Password$: rdbPass,
            Fl32_Auth_Back_Store_RDb_Schema_Password_Reset$: rdbReset,
        }
    ) {
        // VARS
        const A_PASS = rdbPass.getAttributes();
        const A_RESET = rdbReset.getAttributes();

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
            if (hash) dto.hash = hash;
            if (salt) dto.salt = salt;
            return await crud.create(trx, rdbPass, dto);
        };
        /**
         * Read the password salt for the given user.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @return {Promise<{salt:string}>}
         */
        this.readSalt = async function ({trx, userBid}) {
            /** @type {Fl32_Auth_Back_Store_RDb_Schema_Password.Dto} */
            const found = await crud.readOne(trx, rdbPass, userBid);
            if (found?.salt) return {salt: found.salt};
            return {salt: ''};
        };

        /**
         * Create a new reset code in the RDB.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @return {Promise<Fl32_Auth_Back_Store_RDb_Schema_Password_Reset.Dto>}
         */
        this.resetCreate = async function ({trx, userBid}) {
            // clean up the existing reset codes
            const found = await crud.readOne(trx, rdbReset, userBid);
            if (found) await crud.deleteOne(trx, rdbReset, found);
            // generate the new unique code
            let exist, code;
            do {
                code = randomUUID();
                exist = await crud.readOne(trx, rdbReset, {[A_RESET.CODE]: code});
            } while (exist);
            // save the reset code into RDB
            const dto = rdbReset.createDto();
            dto.code = code;
            dto.date_created = new Date();
            dto.user_ref = userBid;
            await crud.create(trx, rdbReset, dto);
            return dto;
        };

        /**
         * Delete the password reset record by given code.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} code
         * @return {Promise<number>}
         */
        this.resetDelete = async function ({trx, code}) {
            return await crud.deleteOne(trx, rdbReset, {[A_RESET.CODE]: code});
        };

        /**
         * Read the password reset record by given code.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} code
         * @return {Promise<Fl32_Auth_Back_Store_RDb_Schema_Password_Reset.Dto>}
         */
        this.resetRead = async function ({trx, code}) {
            return await crud.readOne(trx, rdbReset, {[A_RESET.CODE]: code});
        };

        /**
         * List all records by given email.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} email
         * @return {Promise<Fl32_Auth_Back_Store_RDb_Schema_Password.Dto[]>}
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
            dto.user_ref = userBid;
            dto.hash = hash;
            dto.salt = salt;
            return await crud.updateOne(trx, rdbPass, dto);
        };

        /**
         * Load user data by user reference and validate password's hash.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} [userBid] - the backend ID for the user
         * @param {*} [userRef] - the app-specific identifier for the user (email, uuid, ...).
         * @param {string} hash  - the representation of the password hash as 'base64url' string.
         * @return {Promise<{success: boolean, dbPass: Fl32_Auth_Back_Store_RDb_Schema_Password.Dto}>}
         */
        this.validateHash = async function ({trx, userBid, userRef, hash}) {
            let bid = userBid;
            if (!bid) {
                const {bid: foundBid} = await modUser.read({trx, userRef});
                bid = foundBid;
            }
            const {success, dbPass} = await actPassValid.act({trx, userBid: bid, hash});
            return {success, dbPass};
        };

    }
}

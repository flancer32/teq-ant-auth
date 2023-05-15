/**
 * Password authentication model.
 */
// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_Password {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Back_Act_Password_Validate.act|function} */
        const actPassValid = spec['Fl32_Auth_Back_Act_Password_Validate$'];
        /** @type {Fl32_Auth_Back_Api_Mole} */
        const moleApp = spec['Fl32_Auth_Back_Api_Mole$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        /**
         * Load user data by user reference and validate password's hash.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} userRef - App-specific identifier for the user (email, uuid, ...).
         * @param {string} hashHex - HEX string representation of the password's hash (binary).
         * @return {Promise<{success: boolean, userBid:number}>}
         */
        this.validateHash = async function ({trx, userRef, hashHex}) {
            const {userBid} = await moleApp.load({trx, userRef});
            const {success} = await actPassValid({trx, userBid, hashHex});
            return {success, userBid};
        };

    }
}

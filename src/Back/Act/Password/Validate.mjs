/**
 * Validate the password hash for the given user.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_Password_Validate {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Util_Codec} codec
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Password} rdbPass
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
            Fl32_Auth_Back_Util_Codec$: codec,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Password$: rdbPass,
        }
    ) {
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @param {string} hash - the representation of the password hash as 'base64url' string.
         * @return {Promise<{success: boolean, dbPass: Fl32_Auth_Back_Store_RDb_Schema_Password.Dto}>}
         */
        this.act = async function ({trx, userBid, hash}) {
            let success = false;
            // noinspection JSValidateTypes
            /** @type {Fl32_Auth_Back_Store_RDb_Schema_Password.Dto} */
            const dbPass = await crud.readOne(trx, rdbPass, userBid);
            if (dbPass) {
                const hashFound = codec.binToB64Url(dbPass.hash);
                success = (hashFound === hash);
            }
            return {success, dbPass};
        };
    }

}
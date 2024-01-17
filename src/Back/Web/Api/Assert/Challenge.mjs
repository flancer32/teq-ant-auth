/**
 * Create a new challenge for user sign-in.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Assert_Challenge {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_PubKey} modPubKey
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Assert_Challenge$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_PubKey$: modPubKey,
        }
    ) {
        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const attestRef = req.attestationId;
                //
                // generate challenge and save it to RDb
                const {challenge} = await modPubKey.assertChallengeCreate({trx, attestRef});
                await trx.commit();
                // compose response
                res.attestationId = attestRef;
                res.challenge = challenge;
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

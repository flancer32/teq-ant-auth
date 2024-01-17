/**
 * Validate the user's assertion using the public key.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Assert_Validate {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Util_Codec.b64UrlToBin|function} b64UrlToBin
     * @param {Fl32_Auth_Shared_Web_Api_Assert_Validate} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl32_Auth_Back_Mod_PubKey} modPubKey
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'Fl32_Auth_Back_Util_Codec.b64UrlToBin': b64UrlToBin,
            Fl32_Auth_Shared_Web_Api_Assert_Validate$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl32_Auth_Back_Mod_PubKey$: modPubKey,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }
    ) {
        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Validate.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Validate.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const authenticatorData = b64UrlToBin(req.authenticatorData);
                const clientData = b64UrlToBin(req.clientData);
                const signature = b64UrlToBin(req.signature);
                //
                // generate challenge and save it to RDb
                const {attestation, success} = await modPubKey.assertValidate({
                    trx,
                    authenticatorData,
                    clientData,
                    signature
                });
                if (success) {
                    res.attestationId = attestation.attestation_id;
                    const {sessionData} = await modSess.establish({
                        trx,
                        userBid: attestation.user_ref,
                        request: context.request,
                        response: context.response
                    });
                    if (sessionData) {
                        res.success = true;
                        res.sessionData = sessionData;
                    }
                }
                await trx.commit();
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

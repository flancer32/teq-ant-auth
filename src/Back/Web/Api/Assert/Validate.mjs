/**
 * Validate the user's assertion using the public key.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Assert_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Back_Util_Codec.b64UrlToBin|function} */
        const b64UrlToBin = spec['Fl32_Auth_Back_Util_Codec.b64UrlToBin'];
        /** @type {Fl32_Auth_Shared_Web_Api_Assert_Validate} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Assert_Validate$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Auth_Back_Mod_PubKey} */
        const modPubKey = spec['Fl32_Auth_Back_Mod_PubKey$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);

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

/**
 * Validate the new attestation on the backend and save the user's public key if it is validated.
 */
// MODULE'S IMPORTS
import {decode} from 'cbor';
import cosekey from 'parse-cosekey';

// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Attest {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Util_Codec.b64UrlToBin|function} b64UrlToBin
     * @param {Fl32_Auth_Back_Util_Codec.binToB64Url|function} binToB64Url
     * @param {Fl32_Auth_Back_Util_WebAuthn.decodeAttestationObj|function} decodeAttestationObj
     * @param {Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON|function} decodeClientDataJSON
     * @param {Fl32_Auth_Back_Util_WebAuthn.decodeAuthData|function} decodeAuthData
     * @param {TeqFw_Core_Back_Util_Cast.castBuffer|function} castBuffer
     * @param {Fl32_Auth_Shared_Web_Api_Attest} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Attest_Challenge} rdbChlng
     * @param {Fl32_Auth_Back_RDb_Schema_Attest} rdbPk
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'Fl32_Auth_Back_Util_Codec.b64UrlToBin': b64UrlToBin,
            'Fl32_Auth_Back_Util_Codec.binToB64Url': binToB64Url,
            'Fl32_Auth_Back_Util_WebAuthn.decodeAttestationObj': decodeAttestationObj,
            'Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON': decodeClientDataJSON,
            'Fl32_Auth_Back_Util_WebAuthn.decodeAuthData': decodeAuthData,
            'TeqFw_Core_Back_Util_Cast.castBuffer': castBuffer,
            Fl32_Auth_Shared_Web_Api_Attest$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Attest_Challenge$: rdbChlng,
            Fl32_Auth_Back_RDb_Schema_Attest$: rdbPk,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }
    ) {
        // VARS
        const A_PK = rdbPk.getAttributes();


        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Attest.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Attest.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const cred = req.cred;
                const attestationObj = decodeAttestationObj(cred.attestationObj);
                const clientData = decodeClientDataJSON(cred.clientData);
                // parse attestation and client data properties
                const bin = b64UrlToBin(clientData.challenge);
                const challenge = castBuffer(bin);
                /** @type {Fl32_Auth_Back_RDb_Schema_Attest_Challenge.Dto} */
                const found = await crud.readOne(trx, rdbChlng, challenge);
                if (found) {
                    const userBid = found.user_ref;
                    const authData = decodeAuthData(attestationObj.authData);
                    // extract public key and store it in RDb
                    const pkeyDecoded = decode(authData.publicKeyCose);
                    const pkeyJwk = cosekey.KeyParser.cose2jwk(pkeyDecoded);
                    const dtoPk = rdbPk.createDto();
                    dtoPk.attestation_id = cred.attestationId;
                    dtoPk.public_key = JSON.stringify(pkeyJwk);
                    dtoPk.user_ref = userBid;
                    const {[A_PK.BID]: pkeyBid} = await crud.create(trx, rdbPk, dtoPk);
                    res.attestationId = cred.attestationId;
                    res.publicKeyBid = pkeyBid;
                    logger.info(`New public key is registered for user #${userBid} and attestation '${cred.attestationId}'.`);
                    // remove used challenge
                    await crud.deleteOne(trx, rdbChlng, found);
                    logger.info(`Attestation challenge '${binToB64Url(challenge)}' is deleted.`);
                    const {sessionData} = await modSess.establish({
                        trx,
                        userBid,
                        request: context.request,
                        response: context.response
                    });
                    if (sessionData) res.sessionData = sessionData;
                } else {
                    logger.info(`Cannot find attestation challenge '${binToB64Url(challenge)}.`);
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

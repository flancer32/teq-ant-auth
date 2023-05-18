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
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Back_Util_Codec.b64UrlToBin|function} */
        const b64UrlToBin = spec['Fl32_Auth_Back_Util_Codec.b64UrlToBin'];
        /** @type {Fl32_Auth_Back_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Fl32_Auth_Back_Util_Codec.binToB64Url'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.decodeAttestationObj|function} */
        const decodeAttestationObj = spec['Fl32_Auth_Back_Util_WebAuthn.decodeAttestationObj'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON|function} */
        const decodeClientDataJSON = spec['Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.decodeAuthData|function} */
        const decodeAuthData = spec['Fl32_Auth_Back_Util_WebAuthn.decodeAuthData'];
        /** @type {TeqFw_Core_Back_Util_Cast.castBuffer|function} */
        const castBuffer = spec['TeqFw_Core_Back_Util_Cast.castBuffer'];
        /** @type {Fl32_Auth_Shared_Web_Api_Attest} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Attest$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Attest_Challenge} */
        const rdbChlng = spec['Fl32_Auth_Back_RDb_Schema_Attest_Challenge$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Attest} */
        const rdbPk = spec['Fl32_Auth_Back_RDb_Schema_Attest$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);
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

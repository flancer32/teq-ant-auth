/**
 * Validate the user's assertion using the public key.
 *
 * @namespace Fl32_Auth_Back_Act_Assert_Validate
 * @deprecated TODO: remove it or use it
 */
// MODULE'S IMPORT
import {createHash, subtle} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Assert_Validate';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {Fl32_Auth_Back_Util_Codec} codec
 * @param {Fl32_Auth_Back_Util_WebAuthn.asn1toRaw|function} asn1toRaw
 * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
 * @param {Fl32_Auth_Back_RDb_Schema_Assert_Challenge} rdbChallenge
 * @param {Fl32_Auth_Back_RDb_Schema_Attest} rdbPk
 */
export default function (
    {
        TeqFw_Core_Shared_Api_Logger$: logger,
        Fl32_Auth_Back_Util_Codec$: codec,
        'Fl32_Auth_Back_Util_WebAuthn.asn1toRaw': asn1toRaw,
        TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
        Fl32_Auth_Back_RDb_Schema_Assert_Challenge$: rdbChallenge,
        Fl32_Auth_Back_RDb_Schema_Attest$: rdbPk,
    }
) {
    // VARS
    logger.setNamespace(NS);
    const A_CHALLENGE = rdbChallenge.getAttributes();

    // FUNCS
    /**
     * Generate a challenge to authenticate a new user and save the challenge in the database.
     * Return a base64 URL-encoded challenge.

     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {Buffer} authenticatorData
     * @param {Buffer} clientData
     * @param {Buffer} signature
     * @return {Promise<{attestation: Fl32_Auth_Back_RDb_Schema_Attest.Dto,success: boolean}>}
     * @memberOf Fl32_Auth_Back_Act_Assert_Validate
     */
    async function act({trx, authenticatorData, clientData, signature}) {
        let attestation, success = false;
        const getClientDataJSON = codec.b64UrlToBin(clientData);
        // load corresponded challenge
        const challenge = clientData.challenge;
        /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge.Dto} */
        const found = await crud.readOne(trx, rdbChallenge, {[A_CHALLENGE.CHALLENGE]: challenge});
        if (found) {
            const attestBid = found.attest_ref;
            /** @type {Fl32_Auth_Back_RDb_Schema_Attest.Dto} */
            const foundAttest = await crud.readOne(trx, rdbPk, attestBid);
            const pkeyJwk = JSON.parse(foundAttest.public_key);
            const publicKey = await subtle.importKey('jwk', pkeyJwk, {
                name: 'ECDSA',
                namedCurve: 'P-256'
            }, false, ['verify']);
            const clientDataJson = getClientDataJSON.toString();
            const clientDataHash = createHash('sha256').update(clientDataJson).digest();
            const algorithm = {name: 'ECDSA', hash: 'SHA-256'};
            const sigRaw = asn1toRaw(signature);
            const valid = await subtle.verify(
                algorithm,
                publicKey,
                sigRaw,
                Buffer.concat([authenticatorData, clientDataHash])
            );
            if (valid) {
                logger.info(`User #${foundAttest.user_ref} with attestation '${attestBid}' is authenticated.`);
                attestation = foundAttest;
                success = true;
            } else {
                logger.info(`Assertion of attestation '${foundAttest.attestation_id}' for user #${foundAttest.user_ref}} is not validated.`);
            }
        } else {
            logger.info(`Cannot find assertion challenge '${challenge}'.`);
        }
        return {attestation, success};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
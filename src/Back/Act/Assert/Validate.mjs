/**
 * Validate assertion data got from frontend.
 *
 * @namespace Fl32_Auth_Back_Act_Assert_Validate
 */
// MODULE'S IMPORT
import {createHash, subtle} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Assert_Validate';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {Fl32_Auth_Back_Util_Codec.b64UrlToBin|function} */
    const b64UrlToBin = spec['Fl32_Auth_Back_Util_Codec.b64UrlToBin'];
    /** @type {Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON|function} */
    const decodeClientDataJSON = spec['Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON'];
    /** @type {Fl32_Auth_Back_Util_WebAuthn.asn1toRaw|function} */
    const asn1toRaw = spec['Fl32_Auth_Back_Util_WebAuthn.asn1toRaw'];
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge} */
    const rdbChallenge = spec['Fl32_Auth_Back_RDb_Schema_Assert_Challenge$'];
    /** @type {Fl32_Auth_Back_RDb_Schema_Attest} */
    const rdbPk = spec['Fl32_Auth_Back_RDb_Schema_Attest$'];

    // VARS
    logger.setNamespace(NS);
    const A_CHALLENGE = rdbChallenge.getAttributes();

    // FUNCS
    /**
     * Generate a challenge to authenticate a new user and save the challenge in the database.
     * Return a base64 URL-encoded challenge.

     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {Fl32_Auth_Shared_Dto_Assert.Dto} assertion
     * @return {Promise<{attestation: Fl32_Auth_Back_RDb_Schema_Attest.Dto,success: boolean}>}
     * @memberOf Fl32_Auth_Back_Act_Assert_Validate
     */
    async function act({trx, assertion}) {
        let attestation, success = false;
        const authenticatorData = b64UrlToBin(assertion.authenticatorData);
        const clientData = decodeClientDataJSON(assertion.clientData);
        const getClientDataJSON = b64UrlToBin(assertion.clientData);
        const signature = b64UrlToBin(assertion.signature);
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
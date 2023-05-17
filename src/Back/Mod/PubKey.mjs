/**
 * Public key authentication model.
 */
// MODULE'S IMPORT
import {createHash, subtle} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_PubKey {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Back_Util_Codec.b64UrlToBin|function} */
        const b64UrlToBin = spec['Fl32_Auth_Back_Util_Codec.b64UrlToBin'];
        /** @type {Fl32_Auth_Back_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Fl32_Auth_Back_Util_Codec.binToB64Url'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON|function} */
        const decodeClientDataJSON = spec['Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.asn1toRaw|function} */
        const asn1toRaw = spec['Fl32_Auth_Back_Util_WebAuthn.asn1toRaw'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.createChallenge|function} */
        const createChallenge = spec['Fl32_Auth_Back_Util_WebAuthn.createChallenge'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge} */
        const rdbAssertChl = spec['Fl32_Auth_Back_RDb_Schema_Assert_Challenge$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Attest} */
        const rdbAttest = spec['Fl32_Auth_Back_RDb_Schema_Attest$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Attest_Challenge} */
        const rdbAttestChl = spec['Fl32_Auth_Back_RDb_Schema_Attest_Challenge$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge} */
        const rdbChallenge = spec['Fl32_Auth_Back_RDb_Schema_Assert_Challenge$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_ATTEST = rdbAttest.getAttributes();
        const A_CHALLENGE = rdbChallenge.getAttributes();

        // INSTANCE METHODS

        /**
         * Generates a binary challenge to assert a user, saves the challenge to the database, and converts the challenge
         * to base64url format before returning it.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} attestRef - ID of the attestation related to this assertion challenge
         * @return {Promise<{challenge: string}>}
         */
        this.assertChallengeCreate = async function ({trx, attestRef}) {
            let challenge;
            /** @type {Fl32_Auth_Back_RDb_Schema_Attest.Dto} */
            const found = await crud.readOne(trx, rdbAttest, {[A_ATTEST.ATTESTATION_ID]: attestRef});
            if (found?.bid) {
                /** @type {Buffer} */
                const bin = createChallenge();
                const dto = rdbAssertChl.createDto();
                dto.challenge = bin;
                dto.attest_ref = found.bid;
                await crud.create(trx, rdbAssertChl, dto);
                challenge = binToB64Url(bin);
                logger.info(`New assert challenge '${challenge}' is created for attestation #${found.bid}.`);
            } else {
                logger.info(`Cannot find attestation '${attestRef}'.`);
            }
            return {challenge};
        };

        /**
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Buffer} authenticatorData
         * @param {Buffer} clientData
         * @param {Buffer} signature
         * @return {Promise<{attestation: Fl32_Auth_Back_RDb_Schema_Attest.Dto, success: boolean}>}
         */
        this.assertValidate = async function ({trx, authenticatorData, clientData, signature}) {
            let attestation, success = false;
            // load corresponded challenge
            const clientDataDecoded = decodeClientDataJSON(clientData, true);
            const challenge = b64UrlToBin(clientDataDecoded.challenge);
            /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge.Dto} */
            const found = await crud.readOne(trx, rdbChallenge, {[A_CHALLENGE.CHALLENGE]: challenge});
            if (found) {
                const attestBid = found.attest_ref;
                /** @type {Fl32_Auth_Back_RDb_Schema_Attest.Dto} */
                const foundAttest = await crud.readOne(trx, rdbAttest, attestBid);
                const pkeyJwk = JSON.parse(foundAttest.public_key);
                const publicKey = await subtle.importKey('jwk', pkeyJwk, {
                    name: 'ECDSA',
                    namedCurve: 'P-256'
                }, false, ['verify']);
                const clientDataJson = clientData.toString();
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
        };

        /**
         * Generates a binary challenge to attest a new user, saves the challenge to the database, and converts the challenge
         * to base64url format before returning it.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userBid
         * @return {Promise<{challenge: string}>}
         */
        this.attestChallengeCreate = async function ({trx, userBid}) {
            /** @type {Buffer} */
            const bin = createChallenge();
            const dto = rdbAttestChl.createDto();
            dto.challenge = bin;
            dto.user_ref = userBid;
            await crud.create(trx, rdbAttestChl, dto);
            const challenge = binToB64Url(bin);
            logger.info(`New attest challenge '${challenge}' is created for user #${userBid}.`);
            return {challenge};
        };

    }
}

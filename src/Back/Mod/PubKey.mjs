/**
 * Public key authentication model.
 */
// MODULE'S IMPORT
import {createHash, subtle} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
export default class Fl32_Auth_Back_Mod_PubKey {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Back_Util_Codec} codec
     * @param {Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON|function} decodeClientDataJSON
     * @param {Fl32_Auth_Back_Util_WebAuthn.asn1toRaw|function} asn1toRaw
     * @param {Fl32_Auth_Back_Util_WebAuthn.createChallenge|function} createChallenge
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Assert_Challenge} rdbAssertChl
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Attest} rdbAttest
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Attest_Challenge} rdbAttestChl
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Back_Util_Codec$: codec,
            'Fl32_Auth_Back_Util_WebAuthn.decodeClientDataJSON': decodeClientDataJSON,
            'Fl32_Auth_Back_Util_WebAuthn.asn1toRaw': asn1toRaw,
            'Fl32_Auth_Back_Util_WebAuthn.createChallenge': createChallenge,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Assert_Challenge$: rdbAssertChl,
            Fl32_Auth_Back_Store_RDb_Schema_Attest$: rdbAttest,
            Fl32_Auth_Back_Store_RDb_Schema_Attest_Challenge$: rdbAttestChl,
        }
    ) {
        // VARS
        logger.setNamespace(this.constructor.name);
        const A_ATTEST = rdbAttest.getAttributes();
        const A_CHALLENGE = rdbAssertChl.getAttributes();

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
            /** @type {Fl32_Auth_Back_Store_RDb_Schema_Attest.Dto} */
            const found = await crud.readOne(trx, rdbAttest, {[A_ATTEST.ATTESTATION_ID]: attestRef});
            if (found?.bid) {
                /** @type {Buffer} */
                const bin = createChallenge();
                const dto = rdbAssertChl.createDto();
                dto.challenge = bin;
                dto.attest_ref = found.bid;
                await crud.create(trx, rdbAssertChl, dto);
                challenge = codec.binToB64Url(bin);
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
         * @return {Promise<{attestation: Fl32_Auth_Back_Store_RDb_Schema_Attest.Dto, success: boolean}>}
         */
        this.assertValidate = async function ({trx, authenticatorData, clientData, signature}) {
            let attestation, success = false;
            // load corresponded challenge
            const clientDataDecoded = decodeClientDataJSON(clientData, true);
            const challenge = codec.b64UrlToBin(clientDataDecoded.challenge);
            /** @type {Fl32_Auth_Back_Store_RDb_Schema_Assert_Challenge.Dto} */
            const found = await crud.readOne(trx, rdbAssertChl, {[A_CHALLENGE.CHALLENGE]: challenge});
            if (found) {
                const attestBid = found.attest_ref;
                /** @type {Fl32_Auth_Back_Store_RDb_Schema_Attest.Dto} */
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
            const challenge = codec.binToB64Url(bin);
            logger.info(`New attest challenge '${challenge}' is created for user #${userBid}.`);
            return {challenge};
        };

    }
}

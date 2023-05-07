/**
 * A model to handle events related to user authentication with public key.
 * @namespace Fl32_Auth_Front_Mod_PubKey
 */
// MODULE'S IMPORTS
import {b64UrlToBin} from '../Util/Codec.mjs';

// MODULE'S VARS
const CRED_ALG = -7; // 'ES256' as registered in the IANA COSE Algorithms registry
const CRED_TRANS_INT = 'internal';
const CRED_TYPE = 'public-key';
const TIMEOUT = 360000;  // 6 minutes
const TXT_ENCODER = new TextEncoder();

// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_PubKey {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Fl32_Auth_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Fl32_Auth_Shared_Dto_Attest} */
        const dtoCred = spec['Fl32_Auth_Shared_Dto_Attest$'];
        /** @type {Fl32_Auth_Shared_Web_Api_Attest} */
        const apiAttest = spec['Fl32_Auth_Shared_Web_Api_Attest$'];
        /** @type {Fl32_Auth_Shared_Web_Api_Assert_Challenge} */
        const apiSignInChl = spec['Fl32_Auth_Shared_Web_Api_Assert_Challenge$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS

        this.assertChallenge = async function (attestationId) {
            try {
                // parse input data
                const req = apiSignInChl.createReq();
                req.attestationId = attestationId;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiSignInChl);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot create a new sign in challenge on the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Validate the new attestation on the backend and save the user's public key if it is validated.
         *
         * @param {PublicKeyCredential} attestation
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Attest.Response>}
         */
        this.attest = async function (attestation) {
            try {
                // parse input data
                // noinspection JSValidateTypes
                /** @type {AuthenticatorAttestationResponse} */
                const response = attestation.response;
                const attestationObj = response.attestationObject;
                const clientData = response.clientDataJSON;
                // prepare API request
                const cred = dtoCred.createDto();
                cred.attestationId = attestation.id;
                cred.attestationObj = binToB64Url(attestationObj);
                cred.clientData = binToB64Url(clientData);
                const req = apiAttest.createReq();
                req.cred = cred;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiAttest);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot register attestation for a new user on the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Compose `publicKey` options for CredentialsContainer.create() method.
         * @param {string} challenge base64 url encoded binary (32 bytes)
         * @param {string} rpName relying party name
         * @param {string} userName
         * @param {string} userUuid
         * @returns {Object}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create (publicKey)
         */
        this.composeOptPkCreate = function ({challenge, rpName, userName, userUuid}) {
            const userIdBytes = TXT_ENCODER.encode(userUuid);
            const user = {
                id: userIdBytes,
                name: userName,
                displayName: userName,
            };
            const challengeBin = b64UrlToBin(challenge);
            return {
                // Relying Party:
                rp: {
                    // id: RELYING_PARTY_ID, // origin for Relying Party - host.com
                    name: rpName,
                },
                // User:
                user,
                challenge: challengeBin, // The challenge is produced by the server
                pubKeyCredParams: [  // This Relying Party will accept an ES256 credential
                    {
                        type: CRED_TYPE,
                        alg: CRED_ALG,
                    }
                ],
                timeout: TIMEOUT,
                excludeCredentials: [],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    // Try to use UV if possible. This is also the default.
                    userVerification: 'preferred'
                },
            };

        };

        /**
         * Compose `publicKey` options for CredentialsContainer.create() method.
         * @param {string} challenge base64 url encoded binary (32 bytes)
         * @param {string} attestationId
         * @returns {Object}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get
         */
        this.composeOptPkGet = function ({challenge, attestationId}) {
            const challengeBin = b64UrlToBin(challenge);
            const rawId = b64UrlToBin(attestationId);
            return {
                challenge: challengeBin,
                allowCredentials: [{
                    id: rawId,
                    type: CRED_TYPE,
                    transports: [CRED_TRANS_INT]
                }],
            };

        };

        /**
         * @return {Promise<boolean>}
         */
        this.isPublicKeyAvailable = async function () {
            return await window?.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        };

    }
}

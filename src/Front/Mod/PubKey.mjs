/**
 * A model to handle events related to user authentication with public key.
 * @namespace Fl32_Auth_Front_Mod_PubKey
 */
// MODULE'S VARS
const CRED_ALG_ES256 = -7; // 'ES256' as registered in the IANA COSE Algorithms registry
const CRED_ALG_RS256 = -257; // 'RS256' as registered in the IANA COSE Algorithms registry
const CRED_TRANS_INT = 'internal';
const CRED_TYPE = 'public-key';
const TIMEOUT = 360000;  // 6 minutes
const TXT_ENCODER = new TextEncoder();

// MODULE'S CLASSES
export default class Fl32_Auth_Front_Mod_PubKey {
    /**
     * @param {Fl32_Auth_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Front_Util_Codec} codec
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Dto_Attest} dtoCred
     * @param {Fl32_Auth_Shared_Web_Api_Attest} apiAttest
     * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge} apiAssertChl
     * @param {Fl32_Auth_Shared_Web_Api_Assert_Validate} apiAssertValid
     * @param {Fl32_Auth_Front_Mod_Session} modSess
     */
    constructor(
        {
            Fl32_Auth_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Front_Util_Codec: codec,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Dto_Attest$: dtoCred,
            Fl32_Auth_Shared_Web_Api_Attest$: apiAttest,
            Fl32_Auth_Shared_Web_Api_Assert_Challenge$: apiAssertChl,
            Fl32_Auth_Shared_Web_Api_Assert_Validate$: apiAssertValid,
            Fl32_Auth_Front_Mod_Session$: modSess,
        }
    ) {
        // MAIN
        const STORE_KEY = `${DEF.SHARED.NAME}/attestation`;

        // FUNCS
        /**
         * Read attestation ID from local storage.
         * @return {string|null}
         */
        function attestIdRead() {
            const stored = window.localStorage.getItem(STORE_KEY);
            if (stored) {
                const json = JSON.parse(stored);
                return json?.id ? json.id : null;
            }
            return null;
        }

        /**
         * Write attestation ID to local storage.
         * @param {string} id
         */
        function attestIdWrite(id) {
            window.localStorage.setItem(STORE_KEY, JSON.stringify({id}));
        }

        // INSTANCE METHODS

        /**
         * Get assertion challenge from backend.
         * @return {Promise<Fl32_Auth_Shared_Web_Api_Assert_Challenge.Response>}
         */
        this.assertChallenge = async function () {
            try {
                // parse input data
                const req = apiAssertChl.createReq();
                req.attestationId = attestIdRead();
                // noinspection JSValidateTypes
                return await connApi.send(req, apiAssertChl);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot create a new assertion challenge on the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Validate the new attestation on the backend and save the user's public key if it is validated.
         *
         * @param {PublicKeyCredential} attestation
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Attest.Response>}
         */
        this.attest = async function ({attestation}) {
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
                cred.attestationObj = codec.binToB64Url(attestationObj);
                cred.clientData = codec.binToB64Url(clientData);
                const req = apiAttest.createReq();
                req.cred = cred;
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Attest.Response} */
                const res = await connApi.send(req, apiAttest);
                if (res?.attestationId) attestIdWrite(res.attestationId);
                if (res?.sessionData) modSess.setData(res?.sessionData);
                return res;
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
         * @param {string} userName - a human-friendly user display name (example: "John Doe").
         * @param {ArrayBuffer} userId - a unique ID for the user account (less than 64 bytes).
         * @param {string} userUuid - a human-friendly identifier for the user's account (email, phone, login, ...).
         * @returns {Object}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create (publicKey)
         */
        this.composeOptPkCreate = function ({challenge, rpName, userName, userId, userUuid}) {
            // FUNCS

            function userIdToBytes(userId, userUuid) {
                const initBytes = (userId) ? userId : TXT_ENCODER.encode(userUuid);
                const uint8 = new Uint8Array(initBytes);
                return uint8.subarray(0, 64);
            }

            // MAIN
            const userIdBytes = userIdToBytes(userId, userUuid);
            const user = {
                id: userIdBytes,
                name: userUuid ? userUuid : userName,
                displayName: userName,
            };
            const challengeBin = codec.b64UrlToBin(challenge);
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
                    {type: CRED_TYPE, alg: CRED_ALG_ES256},
                    {type: CRED_TYPE, alg: CRED_ALG_RS256},
                ],
                timeout: TIMEOUT,
                excludeCredentials: [],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform', // platform | cross-platform
                    // requireResidentKey: false,
                    // residentKey: 'discouraged|preferred|required',
                    userVerification: 'preferred', // required | preferred | discouraged
                },
            };

        };

        /**
         * Compose `publicKey` options for CredentialsContainer.get() method.
         * @param {string} challenge base64 url encoded binary (32 bytes)
         * @param {string} attestationId
         * @returns {Object}
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get
         */
        this.composeOptPkGet = function ({challenge, attestationId}) {
            const challengeBin = codec.b64UrlToBin(challenge);
            const rawId = codec.b64UrlToBin(attestationId);
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
         * Return 'true' if attestation ID exist in the local storage.
         * @return {boolean}
         */
        this.isAttestationExist = function () {
            return Boolean(attestIdRead());
        };

        /**
         * @return {Promise<boolean>}
         */
        this.isPublicKeyAvailable = async function () {
            return await window?.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        };

        /**
         * Validate the user's assertion using the public key.
         * @param {AuthenticatorAssertionResponse} assert
         * @returns {Promise<Fl32_Auth_Shared_Web_Api_Assert_Validate.Response>}
         */
        this.validate = async function (assert) {
            try {
                const req = apiAssertValid.createReq();
                req.authenticatorData = codec.binToB64Url(assert.authenticatorData);
                req.clientData = codec.binToB64Url(assert.clientDataJSON);
                req.signature = codec.binToB64Url(assert.signature);
                // noinspection JSValidateTypes
                /** @type {Fl32_Auth_Shared_Web_Api_Assert_Validate.Response} */
                const res = await connApi.send(req, apiAssertValid);
                // set session data to the session model
                if (res?.success) modSess.setData(res?.sessionData);
                return res;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get validate public key assertion on backend. Error: ${e?.message}`);
            }
            return null;
        };

    }
}

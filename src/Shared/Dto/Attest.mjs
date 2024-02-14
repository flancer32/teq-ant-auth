/**
 * DTO to represent public key credentials for attestation process.
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Dto_Attest';

/**
 * @memberOf Fl32_Auth_Shared_Dto_Attest
 * @type {Object}
 */
export const ATTR = {
    ATTESTATION_ID: 'attestationId',
    ATTESTATION_OBJ: 'attestationObj',
    CLIENT_DATA: 'clientData',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Shared_Dto_Attest
 */
class Dto {
    static namespace = NS;
    /**
     * Base64url encoded binary value for `PublicKeyCredential.rawId`.
     * @type {string}
     */
    attestationId;
    /**
     * Base64url encoded binary value for `AuthenticatorAttestationResponse.attestationObject`.
     * @type {string}
     */
    attestationObj;
    /**
     * Base64url encoded binary value for `AuthenticatorResponse.clientDataJSON`.
     * @type {string}
     */
    clientData;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Shared_Dto_Attest {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        /**
         * @param {Fl32_Auth_Shared_Dto_Attest.Dto} [data]
         * @return {Fl32_Auth_Shared_Dto_Attest.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.attestationId = cast.string(data?.attestationId);
            res.attestationObj = cast.string(data?.attestationObj);
            res.clientData = cast.string(data?.clientData);
            return res;
        };
    }
}

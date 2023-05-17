/**
 * DTO to represent public key credentials for assertion process.
 * TODO: remove it
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Shared_Dto_Assert';

/**
 * @memberOf Fl32_Auth_Shared_Dto_Assert
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
 * @memberOf Fl32_Auth_Shared_Dto_Assert
 */
class Dto {
    static namespace = NS;
    /**
     * Base64url encoded binary value for `AuthenticatorAssertionResponse.authenticatorData`.
     * @type {string}
     */
    authenticatorData;
    /**
     * Base64url encoded binary value for `AuthenticatorResponse.clientDataJSON`.
     * @type {string}
     */
    clientData;
    /**
     * Base64url encoded binary value for `AuthenticatorAssertionResponse.signature`.
     * @type {string}
     */
    signature;
    /**
     * Base64url encoded binary value for `AuthenticatorAssertionResponse.userHandle`.
     * @type {string}
     */
    userHandle;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl32_Auth_Shared_Dto_Assert {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Fl32_Auth_Shared_Dto_Assert.Dto} [data]
         * @return {Fl32_Auth_Shared_Dto_Assert.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.authenticatorData = castString(data?.authenticatorData);
            res.clientData = castString(data?.clientData);
            res.signature = castString(data?.signature);
            res.userHandle = castString(data?.userHandle);
            return res;
        };
    }
}

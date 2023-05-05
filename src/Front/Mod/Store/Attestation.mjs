/**
 * Model to store attestation data on the front.
 * @namespace Fl32_Auth_Front_Mod_Store_Attestation
 */
// MODULE'S VARS
const NS = 'Fl32_Auth_Front_Mod_Store_Attestation';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Auth_Front_Mod_Store_Attestation
 */
export class Dto {
    static namespace = NS;
    /** @type {string} */
    attestationId;
}

/**
 * @memberOf Fl32_Auth_Front_Mod_Store_Attestation
 */
export class Store {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Front_Defaults} */
        const DEF = spec['Svelters_Front_Defaults$'];

        // VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/user/attestation`;

        // INSTANCE METHODS
        /**
         * Load attestation data from the store.
         * @returns {Fl32_Auth_Front_Mod_Store_Attestation.Dto}
         */
        this.read = function () {
            const stored = self.window.localStorage.getItem(STORE_KEY);
            const res = new Dto();
            return stored ? Object.assign(res, JSON.parse(stored)) : res;
        };

        /**
         * Save attestation data to the store.
         * @param {Fl32_Auth_Front_Mod_Store_Attestation.Dto} data
         * @returns {string}
         */
        this.write = function (data) {
            window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
        };

    }
}

/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl32_Auth_Front_Defaults {

    SALT_BYTES = 16; // number of bytes in a password salt

    /** @type {Fl32_Auth_Shared_Defaults} */
    SHARED;

    /**
     * @param {Fl32_Auth_Shared_Defaults} SHARED
     */
    constructor(
        {
            Fl32_Auth_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}

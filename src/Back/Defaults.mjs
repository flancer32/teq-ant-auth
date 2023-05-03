/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Auth_Back_Defaults {

    /** @type {Fl32_Auth_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Fl32_Auth_Shared_Defaults$'];
        Object.freeze(this);
    }
}

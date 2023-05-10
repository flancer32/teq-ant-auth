/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Fl32_Auth_Shared_Defaults {
    // should be the same as `name` property in `./package.json`
    NAME = '@flancer32/teq-ant-auth';

    /** @type {TeqFw_Web_Api_Shared_Defaults} */
    MOD_WEB_API;

    constructor(spec) {
        // DEPS
        this.MOD_WEB_API = spec['TeqFw_Web_Api_Shared_Defaults$'];

        Object.freeze(this);
    }
}

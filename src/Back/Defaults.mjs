/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Auth_Back_Defaults {

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    COOKIE_SESSION_FRONT_NAME = 'TEQ_SESSION_FRONT';
    COOKIE_SESSION_USER_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    COOKIE_SESSION_USER_NAME = 'TEQ_SESSION_USER';

    REQ_HTTP_SESSION_FRONT_ID = '@flancer32/teq-ant-auth/frontSessionId';
    REQ_HTTP_SESSION_USER_ID = '@flancer32/teq-ant-auth/userSessionId';

    /** @type {Fl32_Auth_Shared_Defaults} */
    SHARED;

    /**
     * @param {TeqFw_Web_Back_Defaults} MOD_WEB
     * @param {Fl32_Auth_Shared_Defaults} SHARED
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: MOD_WEB,
            Fl32_Auth_Shared_Defaults$: SHARED,
        }
    ) {
        // DEPS
        this.MOD_WEB = MOD_WEB;
        this.SHARED = SHARED;
        // MAIN
        Object.freeze(this);
    }
}

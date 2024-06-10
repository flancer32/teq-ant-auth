/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Auth_Back_Defaults {

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    COOKIE_SESSION_FRONT_NAME = 'TEQ_SESSION_FRONT';
    COOKIE_SESSION_USER_LIFETIME = 31536000000;  // 365 * 24 * 60 * 60 * 1000
    COOKIE_SESSION_USER_NAME = 'TEQ_SESSION_USER';

    /* The objects are stored in every HTTP request. */
    REQ_HTTP_SESSION_FRONT_ID;
    REQ_HTTP_SESSION_USER_ID;
    REQ_HTTP_USER_AUTH;

    RESET_CODE_LIFETIME = 600000; // 10 minutes (10 * 60 * 1000)

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

        this.REQ_HTTP_SESSION_FRONT_ID = `${SHARED.NAME}/sessionFrontId`;
        this.REQ_HTTP_SESSION_USER_ID = `${SHARED.NAME}/sessionUserId`;
        this.REQ_HTTP_USER_AUTH = `${SHARED.NAME}/userAuth`;
        // MAIN
        Object.freeze(this);
    }
}

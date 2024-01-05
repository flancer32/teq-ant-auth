/**
 * The frontend storage for the user identity.
 */
export default class Fl32_Auth_Front_Store_Local_User {
    /**
     * @param {Fl32_Auth_Front_Defaults} DEF
     * @param {Fl32_Auth_Front_Dto_User} dtoUser
     */
    constructor(
        {
            Fl32_Auth_Front_Defaults$: DEF,
            Fl32_Auth_Front_Dto_User$: dtoUser,
        }) {
        // VARS
        const KEY = `${DEF.SHARED.NAME}/user`;

        // INSTANCE METHODS

        this.clear = function () {
            self.window.localStorage.removeItem(KEY);
        };

        /**
         * Get current configuration from the local storage.
         * @return {Fl32_Auth_Front_Dto_User.Dto}
         */
        this.get = function () {
            const stored = self.window.localStorage.getItem(KEY);
            const obj = JSON.parse(stored);
            return dtoUser.createDto(obj);
        };

        /**
         * Save current configuration into the local storage.
         * @param {Fl32_Auth_Front_Dto_User.Dto} data
         */
        this.set = function (data) {
            self.window.localStorage.setItem(KEY, JSON.stringify(data));
        };

    }
}

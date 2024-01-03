/**
 * Store asymmetric encryption keys in the localStorage.
 */
export default class Fl32_Auth_Front_Store_Local_User_Keys {
    /**
     * @param {Fl32_Auth_Front_Defaults} DEF
     * @param {Fl32_Auth_Shared_Dto_Identity_Keys} dtoKeys
     */
    constructor(
        {
            Fl32_Auth_Front_Defaults$: DEF,
            Fl32_Auth_Shared_Dto_Identity_Keys$: dtoKeys,
        }) {
        // VARS
        const KEY = `${DEF.SHARED.NAME}/user/keys`;

        // INSTANCE METHODS

        this.clear = function () {
            self.window.localStorage.removeItem(KEY);
        };

        /**
         * @return {Fl32_Auth_Shared_Dto_Identity_Keys.Dto}
         */
        this.get = function () {
            const stored = self.window.localStorage.getItem(KEY);
            const obj = JSON.parse(stored);
            return dtoKeys.createDto(obj);
        };

        /**
         * @param {Fl32_Auth_Shared_Dto_Identity_Keys.Dto} data
         */
        this.set = function (data) {
            self.window.localStorage.setItem(KEY, JSON.stringify(data));
        };

    }
}

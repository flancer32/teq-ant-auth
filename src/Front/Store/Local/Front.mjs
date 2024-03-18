/**
 * The frontend storage for the frontend application identity.
 * Don't use the store directly, use it from `Fl32_Auth_Front_Mod_Front`.
 */
export default class Fl32_Auth_Front_Store_Local_Front {
    /**
     * @param {Fl32_Auth_Front_Defaults} DEF
     * @param {Fl32_Auth_Front_Dto_Front} dtoIdentity
     */
    constructor(
        {
            Fl32_Auth_Front_Defaults$: DEF,
            Fl32_Auth_Front_Dto_Front$: dtoIdentity,
        }
    ) {
        // VARS
        const KEY = `${DEF.SHARED.NAME}/front`;

        // INSTANCE METHODS

        this.clear = function () {
            self.window.localStorage.removeItem(KEY);
        };

        /**
         * Get current configuration from the local storage.
         * @return {Fl32_Auth_Front_Dto_Front.Dto}
         */
        this.get = function () {
            const stored = self.window.localStorage.getItem(KEY);
            const obj = JSON.parse(stored);
            return dtoIdentity.createDto(obj);
        };

        /**
         * Get the key for the `localStorage`.
         * @return {string}
         */
        this.key = () => KEY;

        /**
         * Save current configuration into the local storage.
         * @param {Fl32_Auth_Front_Dto_Front.Dto} data
         */
        this.set = function (data) {
            self.window.localStorage.setItem(KEY, JSON.stringify(data));
        };

    }
}

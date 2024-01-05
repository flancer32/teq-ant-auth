/**
 * The identification model for the frontend app.
 */
export default class Fl32_Auth_Front_Mod_Identity {
    /**
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_Front_Register} apiReg
     * @param {Fl32_Auth_Front_Store_Local_Identity} storeIdentity
     */
    constructor(
        {
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_Front_Register$: apiReg,
            Fl32_Auth_Front_Store_Local_Identity$: storeIdentity,
        }
    ) {
        // VARS
        /**
         * @type {Fl32_Auth_Front_Dto_Identity.Dto}
         */
        let _cache;

        // INSTANCE METHODS
        /**
         * @return {Fl32_Auth_Front_Dto_Identity.Dto}
         */
        this.get = function () {
            return _cache;
        };

        /**
         * Load/create app identity data and register the front on the back.
         * @return {Promise<Fl32_Auth_Front_Dto_Identity.Dto>}
         */
        this.init = async function () {
            // FUNCS

            /**
             * @param {string} frontUuid
             * @return {Promise<Fl32_Auth_Shared_Web_Api_Front_Register.Response>}
             */
            async function frontRegister(frontUuid) {
                const req = apiReg.createReq();
                req.frontUuid = frontUuid;
                return await connApi.send(req, apiReg);
            }

            // MAIN
            // load app identity data (if exists) from the local storage.
            const ids = storeIdentity.get();
            if (!ids.frontUuid) ids.frontUuid = self.crypto.randomUUID();
            const rs = await frontRegister(ids.frontUuid);
            if ((ids.backUuid !== rs.backUuid) || (ids.frontBid !== rs.frontBid)) {
                ids.backUuid = rs.backUuid;
                ids.frontBid = rs.frontBid;
                storeIdentity.set(ids);
            }
            _cache = ids;
            return _cache;
        };

    }
}

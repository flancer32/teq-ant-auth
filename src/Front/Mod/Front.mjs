/**
 * A model for aggregating functionality related to the frontend itself.
 * The front data is stored in the localStore and is not cached in the model.
 */
export default class Fl32_Auth_Front_Mod_Front {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Fl32_Auth_Shared_Web_Api_Front_Register} endFrontReg
     * @param {Fl32_Auth_Front_Mod_Crypto_Key_Manager} modKeyMgr
     * @param {Fl32_Auth_Front_Store_Local_Front} storeFront
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Fl32_Auth_Shared_Web_Api_Front_Register$: endFrontReg,
            Fl32_Auth_Front_Mod_Crypto_Key_Manager$: modKeyMgr,
            Fl32_Auth_Front_Store_Local_Front$: storeFront,
        }
    ) {
        // INSTANCE METHODS

        /**
         * The wrapper for the stored frontend data.
         * @return {Fl32_Auth_Front_Dto_Front.Dto}
         */
        this.get = () => storeFront.get();

        /**
         * Init front data on the frontend. Load the front identity from the localStorage or generate and store new one.
         * @return {Promise<Fl32_Auth_Front_Dto_Front.Dto>}
         */
        this.init = async function () {
            // load app identity data (if exists) from the local storage or create new one.
            const res = storeFront.get();
            if (!res.frontUuid || !res?.keysEncrypt?.secret) {
                res.frontUuid = self.crypto.randomUUID();
                res.keysEncrypt = await modKeyMgr.createKeysToEncrypt();
                res.keysSign = await modKeyMgr.createKeysToSign();
                logger.info(`New front UUID '${res.frontUuid}' is generated.`);
                storeFront.set(res);
            }
            return res;
        };

        /**
         * Register the front on the back and get the back UUID.
         * @return {Promise<Fl32_Auth_Front_Dto_Front.Dto>}
         */
        this.register = async function () {
            const res = await this.init();
            const req = endFrontReg.createReq();
            req.frontUuid = res.frontUuid;
            req.keyEncrypt = res.keysEncrypt?.public;
            req.keyVerify = res.keysSign?.public;
            const rs = await connApi.send(req, endFrontReg);
            if (res.backUuid !== rs.backUuid) {
                res.backUuid = rs.backUuid;
                storeFront.set(res);
                logger.info(`The front identity is updated in the localStorage: ${res.frontUuid}/${res.backUuid}`);
            } else {
                logger.info(`The front identity is already synced with the back.`);
            }
            return res;
        };

        /**
         * Update the front data stored in the localStore.
         *
         * @param {Fl32_Auth_Front_Dto_Front.Dto} dto
         */
        this.updateStore = function (dto) {
            storeFront.set(dto);
        };
    }
}

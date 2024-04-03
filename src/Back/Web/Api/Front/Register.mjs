/**
 * Register the current frontend UUID on the backend and get identification data in the response.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Front_Register {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Front_Register} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Front} rdbFront
     * @param {TeqFw_Core_Back_Mod_App_Uuid} modBackUuid
     * @param {Fl32_Auth_Back_Act_Front_Create} actCreate
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Front_Register$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Front$: rdbFront,
            TeqFw_Core_Back_Mod_App_Uuid$: modBackUuid,
            Fl32_Auth_Back_Act_Front_Create$: actCreate,
        }
    ) {
        // VARS
        const A_FRONT = rdbFront.getAttributes();
        /** @type {string} */
        let _backUuid;

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () {
            _backUuid = modBackUuid.get();
        };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Front_Register.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Front_Register.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                const uuid = req.frontUuid;
                const keyEncrypt = req.keyEncrypt;
                const keyVerify = req.keyVerify;
                /** @type {Fl32_Auth_Back_RDb_Schema_Front.Dto} */
                const found = await crud.readOne(trx, rdbFront, {[A_FRONT.UUID]: uuid});
                if (!found) {
                    // register the new front
                    const enabled = true;
                    const {bid} = await actCreate.act({trx, enabled, keyEncrypt, keyVerify, uuid});
                    res.isNew = true;
                    logger.info(`New front '${uuid}' is registered as #${bid}.`);
                } else {
                    // update the last date for existing front
                    found.date_last = new Date();
                    await crud.updateOne(trx, rdbFront, found);
                    logger.info(`The last connection date is updated for front '${uuid}/${found.bid}'.`);
                }
                await trx.commit();
                res.backUuid = _backUuid;
                logger.info(`Response: ${JSON.stringify(res)}`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }
}

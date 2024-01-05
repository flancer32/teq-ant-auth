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
     * @param {TeqFw_Core_Back_Mod_App_Uuid} modBackUuid
     * @param {Fl32_Auth_Back_RDb_Schema_Front} rdbFront
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Front_Register$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            TeqFw_Core_Back_Mod_App_Uuid$: modBackUuid,
            Fl32_Auth_Back_RDb_Schema_Front$: rdbFront,
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
                /** @type {Fl32_Auth_Back_RDb_Schema_Front.Dto} */
                const found = await crud.readOne(trx, rdbFront, {[A_FRONT.UUID]: req.frontUuid});
                if (!found) {
                    // register the new front
                    const dto = rdbFront.createDto();
                    dto.uuid = req.frontUuid;
                    const {[A_FRONT.BID]: bid} = await crud.create(trx, rdbFront, dto);
                    res.frontBid = bid;
                } else {
                    // update the last date for existing front
                    found.date_last = new Date();
                    await crud.updateOne(trx, rdbFront, found);
                    res.frontBid = found.bid;
                }
                await trx.commit();
                res.backUuid = _backUuid;
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

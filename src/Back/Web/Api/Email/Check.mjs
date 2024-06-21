/**
 * Validate the uniqueness of the user email.
 */
// MODULE'S IMPORTS
import parse5322 from 'email-addresses';

// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Email_Check {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Fl32_Auth_Shared_Web_Api_Email_Check} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Password} rdbPass
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Auth_Shared_Web_Api_Email_Check$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Password$: rdbPass,
        }
    ) {
        // VARS
        const A_PASS = rdbPass.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Email_Check.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Email_Check.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const rs = endpoint.createRes();
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const parsed = parse5322(req?.email);
                const email = parsed.addresses[0].address;
                const key = {[A_PASS.EMAIL]: email};
                const found = await crud.readOne(trx, rdbPass, key);
                rs.isUnique = found === null;
                await trx.commit();
                Object.assign(res, rs); // compose the response after the commit
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}

/**
 * Get password salt by user identifier (app specific: email, id, uuid, ...).
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Password_Salt_Read {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Codec.binToHex|function} */
        const binToHex = spec['TeqFw_Core_Shared_Util_Codec.binToHex'];
        /** @type {Fl32_Auth_Shared_Web_Api_Password_Salt_Read} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Password_Salt_Read$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Password} */
        const rdbPass = spec['Fl32_Auth_Back_RDb_Schema_Password$'];
        /** @type {Fl32_Auth_Back_Api_Mole} */
        const moleUser = spec['Fl32_Auth_Back_Api_Mole$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Password_Salt_Read.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS
            async function readPasswordSalt(trx, userBid) {
                /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
                const found = await crud.readOne(trx, rdbPass, userBid);
                return (found?.salt) ? binToHex(found.salt) : null;
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const userRef = req.userRef;
                //
                const {userBid} = await moleUser.load({trx, userRef});
                res.salt = await readPasswordSalt(trx, userBid);
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

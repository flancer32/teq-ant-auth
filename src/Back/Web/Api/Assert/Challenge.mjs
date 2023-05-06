/**
 * Create a new challenge for user sign-in.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl32_Auth_Back_Web_Api_Assert_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Shared_Web_Api_Assert_Challenge} */
        const endpoint = spec['Fl32_Auth_Shared_Web_Api_Assert_Challenge$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge} */
        const rdbChallenge = spec['Fl32_Auth_Back_RDb_Schema_Assert_Challenge$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Attest} */
        const rdbPk = spec['Fl32_Auth_Back_RDb_Schema_Attest$'];
        /** @type {Fl32_Auth_Back_Util_WebAuthn.createChallenge|function} */
        const createChallenge = spec['Fl32_Auth_Back_Util_WebAuthn.createChallenge'];

        // VARS
        logger.setNamespace(this.constructor.name);
        // const A_ID_EMAIL = rdbIdEmail.getAttributes();
        const A_PK = rdbPk.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Request|Object} req
         * @param {Fl32_Auth_Shared_Web_Api_Assert_Challenge.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const attestationId = req.attestationId;
                //
                /** @type {Fl32_Auth_Back_RDb_Schema_Attest.Dto} */
                const found = await crud.readOne(trx, rdbPk, {[A_PK.ATTESTATION_ID]: attestationId});
                if (found) {
                    // generate challenge and save it to RDb
                    const challenge = createChallenge();
                    const dtoChallenge = rdbChallenge.createDto();
                    dtoChallenge.attest_ref = found.bid;
                    dtoChallenge.challenge = challenge;
                    await crud.create(trx, rdbChallenge, dtoChallenge);
                    // compose response
                    res.attestationId = attestationId;
                    res.challenge = challenge;
                } else {
                    logger.info(`Cannot find attestation '${attestationId}'.`);
                }
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}

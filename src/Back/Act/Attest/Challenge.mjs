/**
 * Generates a binary challenge to attest a new user, saves the challenge to the database, and converts the challenge
 * to base64url format before returning it.
 *
 * @namespace Fl32_Auth_Back_Act_Attest_Challenge
 */

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Attest_Challenge';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {Fl32_Auth_Back_Util_Codec.binToB64Url|function} */
    const binToB64Url = spec['Fl32_Auth_Back_Util_Codec.binToB64Url'];
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Fl32_Auth_Back_RDb_Schema_Attest_Challenge} */
    const rdbChallenge = spec['Fl32_Auth_Back_RDb_Schema_Attest_Challenge$'];
    /** @type {Fl32_Auth_Back_Util_WebAuthn.createChallenge|function} */
    const createChallenge = spec['Fl32_Auth_Back_Util_WebAuthn.createChallenge'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Generate a challenge to authenticate a new user and save the challenge in the database.
     * Return a base64 URL-encoded challenge.

     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @return {Promise<{challenge: string}>}
     * @memberOf Fl32_Auth_Back_Act_Attest_Challenge
     */
    async function act({trx, userBid}) {
        /** @type {Buffer} */
        const bin = createChallenge();
        const dto = rdbChallenge.createDto();
        dto.challenge = bin;
        dto.user_ref = userBid;
        await crud.create(trx, rdbChallenge, dto);
        const challenge = binToB64Url(bin);
        logger.info(`New attest challenge '${challenge}' is created for user #${userBid}.`);
        return {challenge};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
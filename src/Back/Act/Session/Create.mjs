/**
 * Create a unique ID for a new session for the given user in RDB.
 *
 * @namespace Fl32_Auth_Back_Act_Session_Create
 */
// MODULE'S IMPORT
import {randomUUID} from 'node:crypto';

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Session_Create';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
 * @param {Fl32_Auth_Back_RDb_Schema_Session} rdbSess
 */
export default function (
    {
        TeqFw_Core_Shared_Api_Logger$: logger,
        TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
        Fl32_Auth_Back_RDb_Schema_Session$: rdbSess,
    }) {
    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Establish a new session for the given user.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @return {Promise<{code: string}>}
     * @memberOf Fl32_Auth_Back_Act_Session_Create
     */
    async function act({trx, userBid}) {
        let code, found;
        // noinspection JSValidateTypes
        /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
        do {
            code = randomUUID();
            found = await crud.readOne(trx, rdbSess, code);
        } while (found);
        const dto = rdbSess.createDto();
        dto.code = code;
        dto.user_ref = userBid;
        await crud.create(trx, rdbSess, dto);
        return {code};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
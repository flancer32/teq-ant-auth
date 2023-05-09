/**
 * Establish a new session for the given user.
 *
 * @namespace Fl32_Auth_Back_Act_Session_Open
 */
// MODULE'S IMPORT
import {randomUUID} from 'node:crypto';

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Session_Open';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Fl32_Auth_Back_RDb_Schema_Session} */
    const rdbSess = spec['Fl32_Auth_Back_RDb_Schema_Session$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Establish a new session for the given user.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @return {Promise<{code: string}>}
     * @memberOf Fl32_Auth_Back_Act_Session_Open
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
/**
 * Adds new password data (hash and salt) for the user.
 *
 * @namespace Fl32_Auth_Back_Act_Password_Create
 */
// MODULE'S IMPORTS
import {Buffer} from 'node:buffer';

// MODULE'S VARS
const NS = 'Fl32_Auth_Back_Act_Password_Create';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {TeqFw_Core_Back_Util_Cast.castBuffer|function} */
    const castBuffer = spec['TeqFw_Core_Back_Util_Cast.castBuffer'];
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Fl32_Auth_Back_RDb_Schema_Password} */
    const rdbPass = spec['Fl32_Auth_Back_RDb_Schema_Password$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Validate the password hash for the given user.
     *
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @param {Buffer|Uint8Array} hash
     * @param {Buffer|Uint8Array} salt
     * @return {Promise<void>}
     * @memberOf Fl32_Auth_Back_Act_Password_Create
     */
    async function act({trx, userBid, hash, salt}) {
        const dto = rdbPass.createDto();
        dto.user_ref = userBid;
        dto.hash = castBuffer(hash);
        dto.salt = castBuffer(salt);
        await crud.create(trx, rdbPass, dto);
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
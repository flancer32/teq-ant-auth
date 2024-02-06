/**
 * Register a new session or update an existing session in the RDB.
 */
// MODULE'S IMPORT
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_Session_Register {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_RDb_Schema_Front} rdbFront
     * @param {Fl32_Auth_Back_RDb_Schema_Session} rdbSess
     * @param {Fl32_Auth_Back_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_RDb_Schema_Front$: rdbFront,
            Fl32_Auth_Back_RDb_Schema_Session$: rdbSess,
            Fl32_Auth_Back_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const A_FRONT = rdbFront.getAttributes();
        const A_SESS = rdbSess.getAttributes();
        const A_USER = rdbUser.getAttributes();

        // MAIN
        /**
         * Register a new session or update an existing session in the RDB.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} userUuid
         * @param {string} frontUuid
         * @return {Promise<{code:string}>}
         */
        this.act = async function ({trx, userUuid, frontUuid}) {
            let code;
            /** @type {Fl32_Auth_Back_RDb_Schema_Front.Dto} */
            const front = await crud.readOne(trx, rdbFront, {[A_FRONT.UUID]: frontUuid});
            /** @type {Fl32_Auth_Back_RDb_Schema_User.Dto} */
            const user = await crud.readOne(trx, rdbUser, {[A_USER.UUID]: userUuid});
            if (front && user) {
                /** @type {Fl32_Auth_Back_RDb_Schema_Session.Dto} */
                const session = await crud.readOne(trx, rdbSess, {
                    [A_SESS.USER_REF]: user.bid,
                    [A_SESS.FRONT_REF]: front.bid,
                });
                if (session) {
                    // update the last connected date
                    session.date_last = new Date();
                    await crud.updateOne(trx, rdbSess, session);
                } else {
                    // register a new session
                    let found;
                    do {
                        code = randomUUID();
                        found = await crud.readOne(trx, rdbSess, {[A_SESS.CODE]: code});
                    } while (found);
                    // create DTO and save it into the RDB
                    const dto = rdbSess.createDto();
                    dto.code = code;
                    dto.user_ref = user.bid;
                    dto.front_ref = front.bid;
                    await crud.create(trx, rdbSess, dto);
                    logger.info(`New session is registered for user ${user.bid}:${user.uuid} and front ${front.bid}:${front.uuid}`);
                }
            }
            return {code};
        };
    }

}
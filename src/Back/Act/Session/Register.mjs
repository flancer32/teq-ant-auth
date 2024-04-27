/**
 * Register a new session or update an existing session in the RDB.
 * TODO: we use this action to update the last connected date, this behaviour is deprecated. The code & word are replaced every time.
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
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Front} rdbFront
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Session} rdbSess
     * @param {Fl32_Auth_Back_Store_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Front$: rdbFront,
            Fl32_Auth_Back_Store_RDb_Schema_Session$: rdbSess,
            Fl32_Auth_Back_Store_RDb_Schema_User$: rdbUser,
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
         * @param {number} [userBid]
         * @param {string} [userUuid]
         * @param {number} [frontBid]
         * @param {string} [frontUuid]
         * @param {string} frontKeyEncrypt
         * @param {string} frontKeyVerify
         * @return {Promise<{code:string, word:string, userUuid:string}>}
         */
        this.act = async function (
            {
                trx,
                userBid,
                userUuid,
                frontBid,
                frontUuid,
                frontKeyEncrypt,
                frontKeyVerify,
            }
        ) {
            let code, word;
            // get the user record
            const keyUser = (typeof userBid === 'number')
                ? {[A_USER.BID]: userBid}
                : {[A_USER.UUID]: userUuid};
            /** @type {Fl32_Auth_Back_Store_RDb_Schema_User.Dto} */
            const user = await crud.readOne(trx, rdbUser, keyUser);
            // we can create/update the session
            if (user) {
                // get the front record
                const keyFront = (typeof frontBid === 'number')
                    ? {[A_FRONT.BID]: frontBid}
                    : {[A_FRONT.UUID]: frontUuid};
                /** @type {Fl32_Auth_Back_Store_RDb_Schema_Front.Dto} */
                let front = await crud.readOne(trx, rdbFront, keyFront);
                if (!front) {
                    // create the new front if not found by UUID
                    front = rdbFront.createDto();
                    front.enabled = true;
                    front.key_encrypt = frontKeyEncrypt;
                    front.key_verify = frontKeyVerify;
                    front.uuid = frontUuid;
                    const {[A_FRONT.BID]: bid} = await crud.create(trx, rdbFront, front);
                    front.bid = bid;
                } else {
                    // TODO: should we replace the keys for the front?
                }
                // generate a new sessionId (code)
                let found;
                do {
                    code = randomUUID();
                    found = await crud.readOne(trx, rdbSess, {[A_SESS.CODE]: code});
                } while (found);
                word = randomUUID(); // a secret word for API requests
                // create new or update existing?
                /** @type {Fl32_Auth_Back_Store_RDb_Schema_Session.Dto} */
                const session = await crud.readOne(trx, rdbSess, {
                    [A_SESS.USER_REF]: user.bid,
                    [A_SESS.FRONT_REF]: front.bid,
                });
                if (session) {
                    // update the existing session
                    session.code = code;
                    session.date_last = new Date();
                    session.word = word;
                    await crud.updateOne(trx, rdbSess, session);
                    logger.info(`The existing session is updated for user ${user.bid}:${user.uuid} and front ${front.bid}:${front.uuid}`);
                } else {
                    // create new session
                    const dto = rdbSess.createDto();
                    dto.code = code; // a cookie stored ID
                    dto.word = word = randomUUID(); // a secret word for API requests
                    dto.user_ref = user.bid;
                    dto.front_ref = front.bid;
                    await crud.create(trx, rdbSess, dto);
                    logger.info(`The new session is registered for user ${user.bid}:${user.uuid} and front ${front.bid}:${front.uuid}`);
                }
                user.date_last = new Date();
                await crud.updateOne(trx, rdbUser, user);
            }
            return {code, word, userUuid};
        };
    }

}
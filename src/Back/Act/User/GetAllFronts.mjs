/**
 * Read all fronts related to the user.
 *
 * @implements TeqFw_Core_Shared_Api_Act
 */
export default class Fl32_Auth_Back_Act_User_GetAllFronts {
    /**
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Front} rdbFront
     * @param {Fl32_Auth_Back_Store_RDb_Schema_Session} rdbSession
     * @param {Fl32_Auth_Back_Store_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl32_Auth_Back_Store_RDb_Schema_Front$: rdbFront,
            Fl32_Auth_Back_Store_RDb_Schema_Session$: rdbSession,
            Fl32_Auth_Back_Store_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const A_SESS = rdbSession.getAttributes();
        const A_USER = rdbUser.getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} [uuid]
         * @return {Promise<Fl32_Auth_Back_Store_RDb_Schema_Front.Dto[]>}
         */
        this.act = async function ({trx, uuid}) {
            const res = [];
            /** @type {Fl32_Auth_Back_Store_RDb_Schema_User.Dto} */
            const user = await crud.readOne(trx, rdbUser, {[A_USER.UUID]: uuid});
            if (user) {
                const where = {[A_SESS.USER_REF]: user.bid};
                /** @type {Fl32_Auth_Back_Store_RDb_Schema_Session.Dto[]} */
                const sessions = await crud.readSet(trx, rdbSession, where);
                for (const session of sessions) {
                    const front = await crud.readOne(trx, rdbFront, session.front_ref);
                    res.push(front);
                }
            }
            return res;
        };
    }

}
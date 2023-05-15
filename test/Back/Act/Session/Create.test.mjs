import assert from 'assert';
import {config as cfgTest, container} from '@teqfw/test';
import {describe, it} from 'mocha';

// SETUP ENV
/** @type {TeqFw_Core_Back_Config} */
const config = await container.get('TeqFw_Core_Back_Config$');
config.init(cfgTest.pathToRoot, 'test');
/** @type {TeqFw_Db_Back_RDb_Connect} */
const conn = await container.get('TeqFw_Db_Back_RDb_Connect$');
await conn.init(config.getLocal('@teqfw/db'));
// SETUP TEST INPUT

// GET OBJECT FROM CONTAINER AND RUN TESTS
/** @type {Fl32_Auth_Back_Act_Session_Create.act|function} */
const act = await container.get('Fl32_Auth_Back_Act_Session_Create$');

describe('Fl32_Auth_Back_Act_Session_Create', function () {
    it('can create action', async () => {
        assert(typeof act === 'function');
    });

    it('can execute action', async () => {
        /** @type {TeqFw_Db_Back_RDb_ITrans} */
        const trx = await conn.startTransaction();
        try {
            const {code} = await act({
                trx,
                userBid: 1
            });
            await trx.commit();
            assert(code);
        } catch (e) {
            await trx.rollback();
        }
        await conn.disconnect();
    });
});


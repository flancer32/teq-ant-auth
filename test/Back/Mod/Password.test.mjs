/**
 * The password authentication model.
 */
import assert from 'assert';
import {config as cfgTest, container} from '@teqfw/test';
import {describe, it} from 'mocha';

// SETUP ENV

/** @type {TeqFw_Core_Back_Config} */
const config = await container.get('TeqFw_Core_Back_Config$');
config.init(cfgTest.pathToRoot, 'test');
const cfgDb = config.getLocal('@teqfw/db');

/**
 * Framework wide RDB connection from DI. This connection is used by event listeners.
 * @type {TeqFw_Db_Back_RDb_Connect}
 */
const connFw = await container.get('TeqFw_Db_Back_RDb_IConnect$');
/** @type {TeqFw_Core_Back_Mod_App_Uuid} */
const modBackUuid = await container.get('TeqFw_Core_Back_Mod_App_Uuid$');
await modBackUuid.init();

// GET OBJECT FROM CONTAINER AND RUN TESTS
/** @type {Fl32_Auth_Back_Mod_Password} */
const mod = await container.get('Fl32_Auth_Back_Mod_Password$');
/** @type {Fl32_Auth_Back_Util_Codec} */
const codec = await container.get('Fl32_Auth_Back_Util_Codec$');
/** @type {TeqFw_Core_Shared_Util_Cast} */
const coreCodec = await container.get('TeqFw_Core_Shared_Util_Cast$');

describe('Fl32_Auth_Back_Mod_Password', function () {
    it('can be instantiated', async () => {
        assert(typeof mod === 'object');
    });

    it('can update the password for a user', async () => {
        await connFw.init(cfgDb);
        const trx = await connFw.startTransaction();
        try {
            const userBid = 2;
            const binHash = coreCodec.bin('passwordHash');
            const binSalt = coreCodec.bin('salt');
            const hash = codec.binToB64Url(binHash);
            const salt = codec.binToB64Url(binSalt);
            await mod.update({trx, userBid, hash, salt});
            const {success} = await mod.validateHash({trx, userBid, hash});
            assert(success);
        } finally {
            await trx.rollback();
            await connFw.disconnect();
        }
    });

});


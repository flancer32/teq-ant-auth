/**
 * Register the current frontend UUID on the backend and get identification data in the response.
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
/** @type {Fl32_Auth_Back_Web_Api_Front_Register} */
const handler = await container.get('Fl32_Auth_Back_Web_Api_Front_Register$');
/** @type {Fl32_Auth_Shared_Web_Api_Front_Register} */
const dtoEnd = await container.get('Fl32_Auth_Shared_Web_Api_Front_Register$');
/** @type {typeof TeqFw_Web_Api_Back_Api_Service_Context} */
const Context = await container.get('TeqFw_Web_Api_Back_Api_Service_Context#');

await handler.init();

describe('Fl32_Auth_Back_Web_Api_Front_Register', function () {
    it('can be instantiated', async () => {
        assert(typeof handler === 'object');
    });

    it('has right endpoint', async () => {
        const endpoint = handler.getEndpoint();
        assert(endpoint.constructor.name === 'Fl32_Auth_Shared_Web_Api_Front_Register');
    });

    describe('can process requests', function () {
        let _bid;

        it('the first registration', async () => {
            await connFw.init(cfgDb);
            try {
                const req = dtoEnd.createReq();
                req.frontUuid = 'test';
                const res = dtoEnd.createRes();
                const context = new Context();
                await handler.process(req, res, context);
                assert(typeof res.backUuid === 'string');
                assert(typeof res.frontBid === 'number');
                _bid = res.frontBid;
            } finally {
                await connFw.disconnect();
            }

        });

        it('the secondary registration', async () => {
            await connFw.init(cfgDb);
            try {
                const req = dtoEnd.createReq();
                req.frontUuid = 'test';
                const res = dtoEnd.createRes();
                const context = new Context();
                await handler.process(req, res, context);
                assert(typeof res.backUuid === 'string');
                assert(res.frontBid === _bid);
            } finally {
                await connFw.disconnect();
            }
        });
    });

});


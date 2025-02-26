"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("src/server/app"));
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const node_child_process_1 = require("node:child_process");
(0, vitest_1.beforeAll)(async () => {
    await app_1.default.ready();
});
(0, vitest_1.afterAll)(async () => {
    await app_1.default.close();
});
(0, vitest_1.beforeEach)(() => {
    (0, node_child_process_1.execSync)('npm run knex migrate:rollback --all');
    (0, node_child_process_1.execSync)('npm run knex migrate:latest');
});
(0, vitest_1.describe)('Transactions routes', () => {
    (0, vitest_1.test)('should be able to create a new transaction', async () => {
        await (0, supertest_1.default)(app_1.default.server)
            .post('/transactions')
            .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
            .expect(201);
    });
    (0, vitest_1.test)('should be able to list all transactions', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.default.server)
            .post('/transactions')
            .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
            .expect(201);
        const cookies = createTransactionResponse.get('Set-Cookie') || [];
        const { body } = await (0, supertest_1.default)(app_1.default.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .send()
            .expect(200);
        (0, vitest_1.expect)(body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: 'Transaction 1',
                amount: 500,
            }),
        ]);
    });
    (0, vitest_1.test)('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.default.server)
            .post('/transactions')
            .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
            .expect(201);
        const cookies = createTransactionResponse.get('Set-Cookie') || [];
        const listTransactionsResponse = await (0, supertest_1.default)(app_1.default.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .send()
            .expect(200);
        const transactionId = listTransactionsResponse.body.transactions[0].id;
        const { body } = await (0, supertest_1.default)(app_1.default.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .send()
            .expect(200);
        (0, vitest_1.expect)(body.transaction).toEqual(vitest_1.expect.objectContaining({
            title: 'Transaction 1',
            amount: 500,
        }));
    });
    vitest_1.test.only('should be able to get the summary', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.default.server)
            .post('/transactions')
            .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
            .expect(201);
        const cookies = createTransactionResponse.get('Set-Cookie') || [];
        await (0, supertest_1.default)(app_1.default.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({ title: 'Transaction 1', amount: 300, type: 'debit' })
            .expect(201);
        const { body } = await (0, supertest_1.default)(app_1.default.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .send()
            .expect(200);
        (0, vitest_1.expect)(body.summary).toEqual({
            amount: 200,
        });
    });
});

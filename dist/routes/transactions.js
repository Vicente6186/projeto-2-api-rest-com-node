"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = transactionRoutes;
const knexfile_1 = require("../database/knexfile");
const zod_1 = require("zod");
const node_crypto_1 = require("node:crypto");
const index_1 = __importDefault(require("../middlewares/index"));
async function transactionRoutes(app) {
    app.post('/', async (request, reply) => {
        const schema = zod_1.z.object({
            title: zod_1.z.string(),
            amount: zod_1.z.number(),
            type: zod_1.z.enum(['credit', 'debit']),
        });
        const { title, amount, type } = schema.parse(request.body);
        let { session_id } = request.cookies;
        if (!session_id)
            session_id = (0, node_crypto_1.randomUUID)();
        reply.cookie('session_id', session_id, {
            path: '/transactions',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        await (0, knexfile_1.database)('transactions').insert({
            id: (0, node_crypto_1.randomUUID)(),
            session_id,
            title,
            amount: type === 'credit' ? amount : amount * -1,
        });
        reply.status(201).send();
    });
    app.get('/', { preHandler: index_1.default }, async (request) => {
        const { session_id } = request.cookies;
        const transactions = await (0, knexfile_1.database)('transactions')
            .select()
            .where('session_id', session_id);
        return { transactions };
    });
    app.get('/:id', { preHandler: index_1.default }, async (request) => {
        const { session_id } = request.cookies;
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const transaction = await (0, knexfile_1.database)('transactions')
            .where({ id, session_id })
            .first();
        return { transaction };
    });
    app.get('/summary', { preHandler: index_1.default }, async (request) => {
        const { session_id } = request.cookies;
        const summary = await (0, knexfile_1.database)('transactions')
            .sum('amount', { as: 'amount' })
            .where('session_id', session_id)
            .first();
        return { summary };
    });
}

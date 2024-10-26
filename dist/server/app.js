"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
require("dotenv/config");
const transactions_1 = require("../routes/transactions");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const app = (0, fastify_1.default)();
app.register(cookie_1.default);
app.register(transactions_1.transactionRoutes, {
    prefix: 'transactions',
});
exports.default = app;

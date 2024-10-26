"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const index_1 = require("../env/index");
const knex_1 = __importDefault(require("knex"));
const node_path_1 = require("node:path");
const config = {
    client: 'sqlite3',
    connection: {
        filename: (0, node_path_1.resolve)(__dirname, index_1.env.DATABASE_URL),
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './migrations',
    },
};
const database = (0, knex_1.default)(config);
exports.database = database;
exports.default = config;

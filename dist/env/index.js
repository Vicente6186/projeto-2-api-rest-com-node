"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = require("node:path");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string(),
    PORT: zod_1.z.coerce.number().optional(),
});
if (process.env.NODE_ENV === 'test') {
    dotenv_1.default.config({
        path: (0, node_path_1.resolve)(__dirname, '.env.test'),
    });
}
else {
    dotenv_1.default.config({
        path: (0, node_path_1.resolve)(__dirname, '.env'),
    });
}
exports.env = envSchema.parse(process.env);

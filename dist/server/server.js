"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../env/index");
const app_1 = __importDefault(require("./app"));
app_1.default
    .listen({
    port: index_1.env.PORT,
})
    .then(() => {
    console.log('HTTP server running!');
});

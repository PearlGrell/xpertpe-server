"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token_create = token_create;
exports.token_verify = token_verify;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../config/settings");
async function token_create(id) {
    try {
        const token = jsonwebtoken_1.default.sign({ id }, settings_1.settings.auth.JWT_SECRET, { algorithm: "HS256" });
        return token;
    }
    catch (error) {
        throw error;
    }
}
async function token_verify(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, settings_1.settings.auth.JWT_SECRET, { algorithms: ["HS256"] });
        return decoded["id"];
    }
    catch (error) {
        throw error;
    }
}

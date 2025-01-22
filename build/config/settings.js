"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.settings = {
    appname: process.env.APP_NAME,
    api_prefix: process.env.API_PREFIX,
    cors: {
        origin: '*',
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    server: {
        port: parseInt(process.env.PORT),
        apiPrefix: process.env.API_PREFIX
    },
    auth: {
        JWT_SECRET: process.env.JWT_SECRET
    },
    mail: {
        smtp_host: process.env.SMTP_HOST,
        smtp_port: parseInt(process.env.SMTP_PORT),
        smtp_user: process.env.SMTP_USER,
        smtp_pass: process.env.SMTP_PASS
    }
};

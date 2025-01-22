"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_crypto_1 = __importDefault(require("node:crypto"));
const send_mail_1 = require("../services/send_mail");
class UserModel {
    constructor(user) {
        this.id = user.id ?? node_crypto_1.default.randomUUID();
        this.name = user.name ?? "";
        this.email = user.email ?? "";
        this.isVerified = user.isVerified ?? false;
        this.role = user.role ?? client_1.$Enums.Role.USER;
        this.createdAt = user.createdAt ?? new Date();
        this.updatedAt = user.updatedAt ?? new Date();
        this.image = user.image ?? '';
        this.phone = user.phone ?? null;
        this.password = user.password ?? '';
        this.salt = user.salt ?? '';
        this.otp = user.otp ?? '';
        if (this.password && this.salt === '') {
            this.setPassword(this.password);
        }
    }
    async setPassword(password) {
        this.salt = node_crypto_1.default.randomBytes(16).toString('hex');
        this.password = node_crypto_1.default.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otp;
        await (0, send_mail_1.sendMail)({
            to: this.email,
            template: 'registration',
            name: this.name,
            otp: otp
        });
    }
    verifyPassword(password) {
        const hash = node_crypto_1.default.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this.password === hash;
    }
    verifyOTP(otp) {
        if (this.otp === otp) {
            this.isVerified = true;
            this.otp = null;
            return true;
        }
        return false;
    }
    resetPassword(password, otp) {
        if (this.otp === otp) {
            this.salt = node_crypto_1.default.randomBytes(16).toString('hex');
            this.password = node_crypto_1.default.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
            this.otp = null;
            return true;
        }
        return false;
    }
    async resendOTP() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otp;
        await (0, send_mail_1.sendMail)({
            to: this.email,
            template: 'resendOTP',
            name: this.name,
            otp: otp
        });
    }
    async sendPasswordReset() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otp;
        await (0, send_mail_1.sendMail)({
            to: this.email,
            template: 'forgot_password',
            name: this.name,
            otp: otp
        });
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            isVerified: this.isVerified,
            image: this.image,
            password: this.password,
            salt: this.salt,
            otp: this.otp,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.default = UserModel;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_crypto_1 = __importDefault(require("node:crypto"));
const send_mail_1 = require("../services/send_mail");
class UserModel {
    constructor(user) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.id = (_a = user.id) !== null && _a !== void 0 ? _a : node_crypto_1.default.randomUUID();
        this.name = (_b = user.name) !== null && _b !== void 0 ? _b : "";
        this.email = (_c = user.email) !== null && _c !== void 0 ? _c : "";
        this.isVerified = (_d = user.isVerified) !== null && _d !== void 0 ? _d : false;
        this.role = (_e = user.role) !== null && _e !== void 0 ? _e : client_1.$Enums.Role.USER;
        this.createdAt = (_f = user.createdAt) !== null && _f !== void 0 ? _f : new Date();
        this.updatedAt = (_g = user.updatedAt) !== null && _g !== void 0 ? _g : new Date();
        this.image = (_h = user.image) !== null && _h !== void 0 ? _h : '';
        this.phone = (_j = user.phone) !== null && _j !== void 0 ? _j : null;
        this.password = (_k = user.password) !== null && _k !== void 0 ? _k : '';
        this.salt = (_l = user.salt) !== null && _l !== void 0 ? _l : '';
        this.otp = (_m = user.otp) !== null && _m !== void 0 ? _m : '';
        if (this.password && this.salt === '') {
            this.setPassword(this.password);
        }
    }
    setPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.salt = node_crypto_1.default.randomBytes(16).toString('hex');
            this.password = node_crypto_1.default.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.otp = otp;
            yield (0, send_mail_1.sendMail)({
                to: this.email,
                template: 'registration',
                name: this.name,
                otp: otp
            });
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
    resendOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.otp = otp;
            yield (0, send_mail_1.sendMail)({
                to: this.email,
                template: 'resendOTP',
                name: this.name,
                otp: otp
            });
        });
    }
    sendPasswordReset() {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            this.otp = otp;
            yield (0, send_mail_1.sendMail)({
                to: this.email,
                template: 'forgot_password',
                name: this.name,
                otp: otp
            });
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
//# sourceMappingURL=userModel.js.map
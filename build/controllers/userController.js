"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByToken = getUserByToken;
exports.signUpUser = signUpUser;
exports.verifyUser = verifyUser;
exports.resendOTP = resendOTP;
exports.loginUser = loginUser;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.resetPassword = resetPassword;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const database_1 = __importDefault(require("../database"));
const sanitize_user_1 = require("../helper/sanitize_user");
const response_1 = require("../helper/response");
const userModel_1 = __importDefault(require("../models/userModel"));
const Token = __importStar(require("../helper/jwt_auth"));
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.user.findMany().then((val) => {
            const users = val.map(sanitize_user_1.sanitize_user);
            if (users.length === 0) {
                return (0, response_1.response)(res, 404, "Users");
            }
            return (0, response_1.response)(res, 200, users, "users");
        }).catch(next);
    });
}
function getUserById(req, res, next) {
    const id = req.params.id;
    database_1.default.user.findUnique({
        where: { id }
    }).then((val) => {
        if (!val) {
            return (0, response_1.response)(res, 404, "User");
        }
        return (0, response_1.response)(res, 200, (0, sanitize_user_1.sanitize_user)(val), "user");
    }).catch(next);
}
function getUserByToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            next(new Error("Token is required"));
        }
        const id = yield Token.token_verify(token).catch(next);
        yield database_1.default.user.findUnique({
            where: { id }
        }).then((val) => {
            if (!val) {
                return (0, response_1.response)(res, 404, "User");
            }
            return (0, response_1.response)(res, 200, (0, sanitize_user_1.sanitize_user)(val), "user");
        }).catch(next);
    });
}
function signUpUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            next(new Error("Name, email and password are required"));
        }
        const user = new userModel_1.default({ name, email, password });
        yield database_1.default.user.create({
            data: user.toJSON()
        }).then((val) => __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.response)(res, 201, yield Token.token_create(user.id), "token");
        })).catch((error) => {
            var _a;
            if (error.code === "P2002" && ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target)) {
                const target = error.meta.target;
                if (target.includes("email")) {
                    next(new Error("Email is already in use."));
                }
                if (target.includes("phone")) {
                    next(new Error("Phone number is already in use."));
                }
            }
            next(error);
        });
    });
}
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            const { otp } = req.body;
            if (!token) {
                next(new Error("Token is required"));
            }
            const id = yield Token.token_verify(token);
            const userDatabase = yield database_1.default.user.findUnique({
                where: { id }
            });
            if (!userDatabase) {
                next(new Error("User not found"));
            }
            const user = new userModel_1.default(userDatabase);
            if (user.verifyOTP(otp)) {
                yield database_1.default.user.update({
                    where: { id },
                    data: user.toJSON()
                });
                return (0, response_1.response)(res, 200, "User verified successfully", "message");
            }
            else {
                return (0, response_1.response)(res, 400, "Invalid OTP", "message");
            }
        }
        catch (error) {
            next(error);
        }
    });
}
function resendOTP(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                next(new Error("Token is required"));
            }
            const id = yield Token.token_verify(token);
            const userDatabase = yield database_1.default.user.findUnique({
                where: { id }
            });
            if (!userDatabase) {
                next(new Error("User not found"));
            }
            const user = new userModel_1.default(userDatabase);
            if (user.isVerified) {
                return (0, response_1.response)(res, 400, "User is already verified", "message");
            }
            user.resendOTP();
            yield database_1.default.user.update({
                where: { id },
                data: user.toJSON()
            });
            return (0, response_1.response)(res, 200, "OTP sent successfully", "message");
        }
        catch (error) {
            next(error);
        }
    });
}
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            next(new Error("Email and password are required"));
        }
        const userDatabase = yield database_1.default.user.findUnique({
            where: { email }
        }).catch(next);
        if (!userDatabase) {
            next(new Error("User not found"));
        }
        const user = new userModel_1.default(userDatabase);
        if (!user.verifyPassword(password)) {
            next(new Error("Invalid password"));
        }
        return (0, response_1.response)(res, 200, "User logged in successfully", "message");
    });
}
function sendPasswordResetEmail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        if (!email) {
            next(new Error("Email is required"));
        }
        const userDatabase = yield database_1.default.user.findUnique({
            where: { email }
        }).catch(next);
        if (!userDatabase) {
            next(new Error("User not found"));
        }
        const user = new userModel_1.default(userDatabase);
        user.sendPasswordReset().then(() => __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.user.update({ where: { email }, data: user.toJSON() });
            return (0, response_1.response)(res, 200, "Password reset email sent successfully", "message");
        })).catch(next);
    });
}
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const { password, otp } = req.body;
        if (!token) {
            next(new Error("Token is required"));
        }
        const id = yield Token.token_verify(token);
        const userDatabase = yield database_1.default.user.findUnique({
            where: { id }
        }).catch(next);
        if (!userDatabase) {
            next(new Error("User not found"));
        }
        const user = new userModel_1.default(userDatabase);
        if (!user.resetPassword(password, otp)) {
            next(new Error("Invalid OTP"));
        }
        yield database_1.default.user.update({
            where: { id },
            data: user.toJSON()
        }).then(() => {
            return (0, response_1.response)(res, 200, "Password reset successfully", "message");
        }).catch(next);
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            next(new Error("Token is required"));
        }
        const id = yield Token.token_verify(token).catch(next);
        const { name, phone, image, role, } = req.body;
        const userDatabase = yield database_1.default.user.findUnique({
            where: { id }
        }).catch(next);
        if (!userDatabase) {
            next(new Error("User not found"));
        }
        const user = new userModel_1.default(userDatabase);
        user.name = name !== null && name !== void 0 ? name : user.name;
        user.phone = phone !== null && phone !== void 0 ? phone : user.phone;
        user.image = image !== null && image !== void 0 ? image : user.image;
        if (role) {
            if (role === "ADMIN") {
                user.role = "ADMIN";
            }
            else if (role === "USER") {
                user.role = "USER";
            }
            else if (role === "EXPERT") {
                user.role = "EXPERT";
            }
            else {
                next(new Error("Invalid role"));
            }
        }
        yield database_1.default.user.update({
            where: { id },
            data: user.toJSON()
        }).then(() => {
            return (0, response_1.response)(res, 200, "User updated successfully", "message");
        }).catch(next);
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            next(new Error("Token is required"));
        }
        const id = yield Token.token_verify(token).catch(next);
        yield database_1.default.user.delete({
            where: { id }
        }).then(() => {
            return (0, response_1.response)(res, 200, "User deleted successfully", "message");
        }).catch(next);
    });
}
//# sourceMappingURL=userController.js.map
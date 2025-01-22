"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize_user = sanitize_user;
function sanitize_user(user) {
    const { password, salt, otp, createdAt, updatedAt, ...sanitizedUser } = user;
    return sanitizedUser;
}

"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize_user = sanitize_user;
function sanitize_user(user) {
    const { password, salt, otp, createdAt, updatedAt } = user, sanitizedUser = __rest(user, ["password", "salt", "otp", "createdAt", "updatedAt"]);
    return sanitizedUser;
}
//# sourceMappingURL=sanitize_user.js.map
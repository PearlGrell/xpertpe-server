import { tUser } from "../types";

export function sanitize_user(user: tUser) {
    const { password, salt, otp, createdAt, updatedAt, ...sanitizedUser } = user;
    return sanitizedUser;
}
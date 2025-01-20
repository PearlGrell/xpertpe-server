import { $Enums } from "@prisma/client";
import crypto from "node:crypto";
import { sendMail } from "../services/send_mail";
import { tUser } from "../types";

interface iUser extends tUser{
    id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
    phone: string | null;
    otp: string | null;
    isVerified: boolean;
    image: string | null;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;

    setPassword(password: string): void;
    verifyPassword(password: string): boolean;
    verifyOTP(otp: string): boolean;
    resendOTP(): void;
    sendPasswordReset(): void;
    resetPassword(password: string, otp: string): boolean;

    toJSON(): Partial<iUser>;
}

class UserModel implements iUser {
    id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
    phone: string | null;
    otp: string | null;
    isVerified: boolean;
    image: string | null;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: Partial<iUser>) {
        this.id = user.id ?? crypto.randomUUID();
        this.name = user.name ?? "";
        this.email = user.email ?? "";
        this.isVerified = user.isVerified ?? false;
        this.role = user.role ?? $Enums.Role.USER;
        this.createdAt = user.createdAt ?? new Date();
        this.updatedAt = user.updatedAt ?? new Date();
        this.image = user.image ?? '';
        this.phone = user.phone ?? null;
        this.password = user.password ?? '';
        this.salt = user.salt ?? '';
        this.otp = user.otp ?? '';
        if(this.password && this.salt === '') {
            this.setPassword(this.password);
        }
    }

    async setPassword(password: string): Promise<void> {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otp;

        await sendMail({
            to: this.email,
            template: 'registration',
            name: this.name,
            otp: otp
        });
    }

    verifyPassword(password: string): boolean {
        const hash = crypto.pbkdf2Sync(password, this.salt!, 1000, 64, 'sha512').toString('hex');
        return this.password === hash;
    }

    verifyOTP(otp: string): boolean {
        if(this.otp === otp) {
            this.isVerified = true;
            this.otp = null;
            return true;
        }
        return false;
    }

    resetPassword(password: string, otp: string): boolean {
        if(this.otp === otp) {
            this.salt = crypto.randomBytes(16).toString('hex');
            this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
            this.otp = null;
            return true;
        }
        return false;
    }

    async resendOTP(): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otp;

        await sendMail({
            to: this.email,
            template: 'resendOTP',
            name: this.name,
            otp: otp
        });
    }

    async sendPasswordReset(): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otp = otp;

        await sendMail({
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

export default UserModel;
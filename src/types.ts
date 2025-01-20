import { $Enums } from "@prisma/client";
import { CorsOptions } from "cors";

export type Settings = {
    appname: string;
    api_prefix: string;
    server: {
          port: number;
          apiPrefix: string;
    };
    cors: CorsOptions,
    auth: {
          JWT_SECRET: string;
    };
    mail: {
            smtp_host: string;
            smtp_port: number;
            smtp_user: string;
            smtp_pass: string;
    }
};

export type tUser = {
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
};
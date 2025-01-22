"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const settings_1 = require("../config/settings");
const mode = {
    registration: 'registration.html',
    forgot_password: 'forgot_password.html',
    resendOTP: 'resend_otp.html',
};
const sendMail = async ({ to, template, ...props }) => {
    try {
        props.name = props.name.split(' ')[0];
        const htmlFilePath = node_path_1.default.join(process.cwd(), 'public', 'templates', mode[template]);
        const htmlContent = node_fs_1.default.readFileSync(htmlFilePath, 'utf8');
        let updatedHtmlContent = Object.entries(props).reduce((content, [key, value]) => content.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), value), htmlContent);
        const mailOptions = {
            from: {
                name: 'XpertPe',
                address: "noreply@xpertpe",
            },
            to,
            subject: `${(template === 'registration') ? "Thank You For Registering" : (template === 'forgot_password') ? "Reset Password" : "Resend OTP"}`,
            html: updatedHtmlContent,
            date: new Date(),
            encoding: 'utf8',
            watchHtml: updatedHtmlContent,
        };
        const transporter = await nodemailer_1.default.createTransport({
            host: settings_1.settings.mail.smtp_host,
            port: settings_1.settings.mail.smtp_port,
            secure: false,
            auth: {
                user: settings_1.settings.mail.smtp_user,
                pass: settings_1.settings.mail.smtp_pass,
            },
        });
        const info = await transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.sendMail = sendMail;

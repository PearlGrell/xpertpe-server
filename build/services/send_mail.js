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
const sendMail = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { to, template } = _a, props = __rest(_a, ["to", "template"]);
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
        const transporter = yield nodemailer_1.default.createTransport({
            host: settings_1.settings.mail.smtp_host,
            port: settings_1.settings.mail.smtp_port,
            secure: false,
            auth: {
                user: settings_1.settings.mail.smtp_user,
                pass: settings_1.settings.mail.smtp_pass,
            },
        });
        const info = yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.sendMail = sendMail;
//# sourceMappingURL=send_mail.js.map
import nodemailer, { SendMailOptions } from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { settings } from '../config/settings';

const mode = {
    registration: 'registration.html',
    forgot_password: 'forgot_password.html',
    resendOTP: 'resend_otp.html',
}

export type template = keyof typeof mode;

type mail = {
    to: string;
    template: template;
    otp: string;
    name: string;
};

const sendMail = async ({ to, template, ...props }: mail) => {
    try {
        props.name =  props.name.split(' ')[0];
        const htmlFilePath = path.join(process.cwd(), 'public', 'templates', mode[template]);
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

        let updatedHtmlContent = Object.entries(props).reduce(
            (content, [key, value]) => content.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), value), htmlContent
        );

        const mailOptions: SendMailOptions = {
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

        const transporter = await nodemailer.createTransport({
            host: settings.mail.smtp_host,
            port: settings.mail.smtp_port,
            secure: false,
            auth: {
                user: settings.mail.smtp_user,
                pass: settings.mail.smtp_pass,
            },
        });

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export { sendMail };
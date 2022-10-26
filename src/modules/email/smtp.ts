import nodemailer from "nodemailer"
import configService from "src/app/config";

const emailConfigs = configService.auth.mailer
const smtpTransport = nodemailer.createTransport({
    service: emailConfigs.SERVICE,

    // host: emailConfigs.HOST,

    auth: {
        user: emailConfigs.USER,

        pass: emailConfigs.PASS,
    },
});
console.log(emailConfigs);
function sendEmail({ to, code, subject, text }: any) {
    console.log({ to, code, subject, text });
    const data = {
        from: emailConfigs.USER,
        to: `${to}`,
        subject: subject || "Verification from Matihan",
        text: text || `link : ${code}`,
    };
    console.log(data);

    smtpTransport.sendMail(data, function (error: any, response: any) {
        console.log({ error, response });
    });
}

function resetPassword(to: any, text: any) {
    const data = {
        from: emailConfigs.USER,
        to: `${to}`,
        subject: "Reset Password",
        text,
    };
    console.log(data);
    smtpTransport.sendMail(data, function (error: any, response: any) {
        console.log(response);
    });
}

module.exports = { sendEmail, resetPassword };

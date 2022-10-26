import nodemailer from "nodemailer"
import configService from "src/app/config";


const mailConfig = {
    service: 'gmail',
    // port: 587,
    auth: {
        user: configService.auth.mailer.email,
        pass: configService.auth.mailer.password,
    },
}

const transporter = nodemailer.createTransport({ ...mailConfig });

export default transporter;

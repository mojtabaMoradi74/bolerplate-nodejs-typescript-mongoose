import nodemailer from "nodemailer"
import transporter from "./emailTransporter"

const sendEmail = async ({ email, html, subject, text }: any) => {

  const data = {
    from: process.env.USER,
    to: email,
    subject,
    html,
  };

  return new Promise((resolve, reject) => {
    const info = transporter.sendMail(data, function (error: any, response: any) {
      console.log(error, response);

      if (error) {
        reject(error)
      } else if (response) {
        resolve(response)
      }

      // logger.info('url: ' + nodemailer.getTestMessageUrl(info));

    });

  })

};

// const sendPasswordReset = async (email, token) => {
//   const info = await transporter.sendMail({
//     from: 'E-commerce store',
//     to: email,
//     subject: 'Password Reset',
//     html: `
//     <div>
//       <b>Please click below link to reset your password</b>
//     </div>
//     <div>
//     4666
//     </div>
//     `,
//   });
//   logger.info('url: ' + nodemailer.getTestMessageUrl(info));
// };
export default sendEmail;

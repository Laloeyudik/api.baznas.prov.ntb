import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS,
  },
});

export default function sendMailer(from, to, subject, link) {
  if (!from || !to || !subject || !link) {
    return Promise.reject(new Error("Missing required email parameters"));
  }

  return new Promise((resolve, reject) => {
    transport.sendMail(
      {
        from: `${from} <no-reply@gmail.com>`,
        to: to,
        subject: subject,
        html: `<h1>Your login link</h1><br><a href="${link}" target="_blank">Login</a>`,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info.response);
        }
      }
    );
  });
}

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  debug: true,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   debug: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: { rejectUnauthorized: true },
// });

transporter.verify(function (error, success) {
  if (error) {
    console.log("Transporter Error: ", error);
  } else {
    console.log("Server is ready to take our messages: ", success);
  }
});

module.exports = transporter;
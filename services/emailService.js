import nodemailer from "nodemailer";

const sendMail = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '`meroShare <${from}>`',
    to,
    subject,
    text,
    html,
  });

  console.log(info);
};

export default sendMail;

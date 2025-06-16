const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email, subject, url) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS  // your app password
      }
    });

    const info = await transporter.sendMail({
      from: `NoteHive <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${url}">${url}</a>
      `
    });

    console.log("✅ Email sent: ", info.response);
  } catch (err) {
    console.error("❌ Email send failed: ", err);
  }
};

module.exports = sendEmail;

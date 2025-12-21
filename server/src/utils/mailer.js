const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

async function sendResetEmail(to, resetLink) {
  return transporter.sendMail({
    from: `"EventHub" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your EventHub password',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password (valid for 15 minutes):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
}

module.exports = { sendResetEmail };

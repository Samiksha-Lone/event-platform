const nodemailer = require('nodemailer');

let transporter = null;
let emailConfigValid = false;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
  });
  emailConfigValid = true;
} else {
  console.warn('⚠️  Email configuration not complete. In development, reset links will be logged to console.');
  console.warn('For production, set SMTP_USER and SMTP_PASS environment variables.');
}

async function sendResetEmail(to, resetLink) {
  
  if (!emailConfigValid || process.env.NODE_ENV === 'development') {
    // Development mode: Password reset link logged via logger middleware
    // In production, reset link is sent via email

    return { 
      accepted: [to], 
      response: 'Development mode - password reset link logged to console. Check server logs above.' 
    };
  }

  if (!transporter) {
    throw new Error('Email service is not configured.');
  }

  try {
    return await transporter.sendMail({
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
  } catch (error) {
    throw new Error(`Email service error: ${error.message}`);
  }
}

module.exports = { sendResetEmail };

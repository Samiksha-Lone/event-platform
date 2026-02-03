const nodemailer = require('nodemailer');
const { logError } = require('../middlewares/logger.middleware');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, html) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️  Email credentials missing. Simulating email send:');
      console.log(`To: ${to}\nSubject: ${subject}\n`);
      return true;
    }

    const info = await transporter.sendMail({
      from: `"EventHub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

async function sendEventReminder(user, event) {
  const subject = `Reminder: ${event.title} is coming up!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Event Reminder</h2>
      <p>Hi ${user.name},</p>
      <p>This is a reminder that <strong>${event.title}</strong> is starting soon.</p>
      
      <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.eventType === 'online' ? 'Online' : event.location}</p>
      </div>
      
      <p>We look forward to seeing you there!</p>
      <a href="${process.env.CLIENT_URL}/event/${event._id}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Event Details</a>
    </div>
  `;

  return sendEmail(user.email, subject, html);
}

async function sendRsvpConfirmation(user, event) {
  const subject = `RSVP Confirmed: ${event.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10B981;">RSVP Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>You have successfully registered for <strong>${event.title}</strong>.</p>
      
      <a href="${process.env.CLIENT_URL}/event/${event._id}" style="display: inline-block; background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">View Ticket</a>
    </div>
  `;

  return sendEmail(user.email, subject, html);
}

module.exports = {
  sendEmail,
  sendEventReminder,
  sendRsvpConfirmation
};

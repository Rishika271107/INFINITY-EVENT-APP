const nodemailer = require('nodemailer');

// Load env variables (ensure they are defined in .env)
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  throw new Error('GMAIL_USER and GMAIL_PASS must be set in environment variables');
}

// Create a reusable transport instance
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Send an email using the pre‑configured Gmail SMTP transport.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML body content.
 * @returns {Promise<nodemailer.SentMessageInfo>} Result of the send operation.
 */
async function sendMail({ to, subject, html }) {
  const mailOptions = {
    from: GMAIL_USER,
    to,
    subject,
    html,
  };
  return transport.sendMail(mailOptions);
}

module.exports = { sendMail };

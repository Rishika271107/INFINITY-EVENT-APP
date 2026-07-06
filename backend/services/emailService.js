const nodemailer = require('nodemailer');

// Load env variables (ensure they are defined in .env)
const MAILJET_SMTP_HOST = process.env.MAILJET_SMTP_HOST;
const MAILJET_SMTP_PORT = Number(process.env.MAILJET_SMTP_PORT);
const MAILJET_USER = process.env.MAILJET_API_KEY; // Mailjet uses API key as username
const MAILJET_PASS = process.env.MAILJET_SECRET_KEY;
const MAILJET_FROM = process.env.MAILJET_FROM;

if (!MAILJET_SMTP_HOST || !MAILJET_SMTP_PORT || !MAILJET_USER || !MAILJET_PASS) {
  throw new Error('Mailjet SMTP credentials must be set in environment variables');
}

// Create a reusable transport instance for Mailjet
const transport = nodemailer.createTransport({
  host: MAILJET_SMTP_HOST,
  port: MAILJET_SMTP_PORT,
  auth: {
    user: MAILJET_USER,
    pass: MAILJET_PASS,
  },
  secure: false, // TLS
  requireTLS: true,
  family: 4, // Force IPv4 to avoid ENETUNREACH on Render
});

// Gmail transport removed – using Mailjet (already defined above)

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

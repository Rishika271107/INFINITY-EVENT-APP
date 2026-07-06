require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

(async () => {
  try {
    console.log("Testing SMTP with Brevo...");
    const info = await sendEmail("rishi.learn27@gmail.com", "Test Email", "This is a test to verify SMTP.", "123456");
    console.log("Success! Message ID:", info.messageId);
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
})();

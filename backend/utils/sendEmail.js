const nodemailer = require("nodemailer");

// Initialize transporter globally to reuse the connection pool
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : "";
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, "") : "";

  if (!user || !pass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables.");
  }

  console.log("SMTP HOST:", process.env.EMAIL_HOST);
  console.log("SMTP PORT:", process.env.EMAIL_PORT);
  console.log("SMTP SECURE:", process.env.EMAIL_SECURE);
  console.log("SMTP USER:", process.env.EMAIL_USER);

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * PRODUCTION-READY GMAIL SMTP
 * Using service: "gmail" for automated configuration and reliability.
 */
const sendEmail = async (email, subject, text, otp = null) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`[TEST] sendEmail to ${email} bypassed in test environment`);
    return { messageId: 'test-message-id' };
  }
  try {
    console.log(`\n📧 ATTEMPTING EMAIL DELIVERY...`);
    console.log(`   Recipient: ${email}`);
    
    const mailTransporter = getTransporter();
    const user = process.env.EMAIL_USER.trim();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 2px solid #d4af37; border-radius: 15px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #000000; margin: 0; letter-spacing: 2px;">INFINITY</h1>
            <p style="color: #d4af37; margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">Grand Events</p>
          </div>
          
          <div style="padding: 20px; color: #333; line-height: 1.6;">
            <h2 style="color: #000; border-bottom: 1px solid #eee; padding-bottom: 10px;">Email Verification</h2>
            <p>Your 6-digit OTP for account access is:</p>
            
            <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #d4af37;">
                ${otp || (text.match(/\d{6}/) ? text.match(/\d{6}/)[0] : "------")}
              </span>
            </div>
            
            <p style="font-size: 14px; color: #666;">This code is valid for 30 minutes. If you did not request this, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
            <p>&copy; 2026 Infinity Grand Events. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log("✅ SUCCESS: Email sent successfully! Message ID:", info.messageId);
    return info;

  } catch (error) {
    console.error("\n❌ SMTP ERROR DETECTED");
    
    if (error.response?.includes("535-5.7.8") || error.response?.includes("535")) {
      console.error("CRITICAL: Your SMTP credentials were REJECTED.");
      console.error("FIX: Ensure your SMTP password (Brevo key) is correct.");
    } else {
      console.error("ERROR TYPE:", error.code || "UNKNOWN");
      console.error("MESSAGE:", error.message);
    }
    
    // Throw error so the controller knows it failed
    throw error;
  }
};

module.exports = sendEmail;
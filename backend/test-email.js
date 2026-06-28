const nodemailer = require("nodemailer");
require("dotenv").config();

const testSMTP = async () => {
  console.log("--- SMTP TEST START ---");
  console.log("User:", process.env.EMAIL_USER);
  console.log("Pass Length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
    },
  });

  try {
    console.log("Verifying transporter...");
    await transporter.verify();
    console.log("SUCCESS: SMTP connection is valid!");

    console.log("Sending test mail...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test",
      text: "If you see this, your SMTP configuration is perfect!",
    });
    console.log("SUCCESS: Test mail sent to yourself!");
  } catch (error) {
    console.error("FAILED: SMTP Error occurred.");
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    
    if (error.response?.includes("535-5.7.8")) {
      console.error("\nCRITICAL: Your Gmail credentials are being rejected.");
      console.error("REASON: Either the password is wrong OR you are not using a 16-digit APP PASSWORD.");
      console.error("FIX: Generate a new App Password at https://myaccount.google.com/apppasswords");
    }
  }
};

testSMTP();

const mongoose = require("mongoose");

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  const connect = async () => {
    try {
      const uri = process.env.MONGO_URI;

      if (!uri) {
        throw new Error("MONGO_URI is not defined in environment variables.");
      }

      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB Connection Attempt ${retries}/${MAX_RETRIES} Failed: ${error.message}`);

      if (retries < MAX_RETRIES) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return connect();
      } else {
        console.error("❌ All MongoDB connection attempts failed.");
        console.error("📋 Common fixes:");
        console.error("   1. Whitelist your IP in MongoDB Atlas → Network Access");
        console.error("   2. Check your MONGO_URI in .env");
        console.error("   3. Ensure your Atlas cluster is running");
        console.error("\n⚠️  Server will continue running without database connection.");
        console.error("   Fix the issue and restart with: npm run dev\n");
      }
    }
  };

  await connect();
};

module.exports = connectDB;
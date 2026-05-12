const http = require("http");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { connectCloudinary } = require("./config/cloudinary");
const { initializeSocket } = require("./sockets/socket");

// ─── DATABASE CONNECTION ───
connectDB();

// ─── CLOUDINARY (optional — only if credentials are set) ───
if (process.env.CLOUDINARY_CLOUD_NAME) {
  connectCloudinary();
}

// ─── HTTP SERVER (needed for Socket.IO) ───
const server = http.createServer(app);

// ─── SOCKET.IO ───
const io = initializeSocket(server);

// Make io accessible in controllers via req.app
app.set("io", io);

// ─── START SERVER ───
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 ═══════════════════════════════════════════`);
  console.log(`   Infinity Grand Events API`);
  console.log(`   Mode:    ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port:    ${PORT}`);
  console.log(`   URL:     http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`═══════════════════════════════════════════════\n`);
});

// ─── GRACEFUL SHUTDOWN ───
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});
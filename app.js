const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware imports
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ─── SECURITY MIDDLEWARE ───
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── RATE LIMITING ───
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter limit for auth endpoints
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ─── BODY PARSING ───
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── DATA SANITIZATION ───
app.use(mongoSanitize());
app.use(xss());

// ─── LOGGING ───
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── STATIC FILES ───
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API ROUTES ───
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/admin", adminRoutes);

// ─── HEALTH CHECK ───
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌟 Infinity Grand Events API is running",
    version: "1.0.0",
    docs: "/api-docs",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── ERROR HANDLING ───
app.use(notFound);
app.use(errorHandler);

module.exports = app;

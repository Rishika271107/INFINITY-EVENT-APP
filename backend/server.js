// Centralized configuration and logger
require('./config/config'); // validates and loads env variables
const logger = require('./utils/logger');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

// Log environment validation (logger will handle output)
logger.info('Environment configuration loaded successfully');

const connectDB = require("./config/db");

console.log("--- ENV VALIDATION ---");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS LOADED:", !!process.env.EMAIL_PASS);
console.log("----------------------");

connectDB();

const app = express();
// Enable trust proxy for correct client IPs behind reverse proxies (e.g., Render, Railway)
app.set('trust proxy', 1);
// Limit JSON payload size to 10kb to mitigate abuse
app.use(express.json({ limit: '10kb' }));
// Security & performance middlewares
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(mongoSanitize());
app.use(xss());

// HTTP request logger using Winston
app.use(morgan('combined', { stream: logger.stream }));

// Enable CORS with options
app.use(cors(require('./config/corsOptions')));

// Set various security headers
app.use(helmet());

// Parse cookies
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, '..', 'frontend', 'build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}




// ROUTES
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/events",
  require("./routes/eventRoutes")
);

app.use(
  "/api/bookings",
  require("./routes/bookingRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

app.use("/api/payment",
  require("./routes/paymentRoutes")
);

app.use("/api/venues",
  require("./routes/venueRoutes")
);

app.use("/api/budgets",
  require("./routes/budgetRoutes")
);

app.use("/api/reminders",
  require("./routes/reminderRoutes")
);

// Error handling middleware (must be after all routes)
const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);



const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_TRIES = 5;

function startServer(port, attempt = 1) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      if (attempt < MAX_PORT_TRIES) {
        const nextPort = port + 1;
        console.warn(`Port ${port} in use, trying port ${nextPort}...`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error(`Unable to bind to a free port after ${MAX_PORT_TRIES} attempts. Please free a port or set a different PORT in your .env file.`);
        process.exit(1);
      }
      return;
    }
    console.error('Server error:', error);
    process.exit(1);
  });
}

if (require.main === module) {
  startServer(DEFAULT_PORT);
}

module.exports = app;
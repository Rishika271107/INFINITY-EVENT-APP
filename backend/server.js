require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

console.log("--- ENV VALIDATION ---");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS LOADED:", !!process.env.EMAIL_PASS);
console.log("----------------------");

connectDB();

const app = express();

app.use(express.json());

app.use(cors(require('./config/corsOptions')));

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());



app.get("/", (req, res) => {
  res.send("Backend Running");
});



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

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
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

    console.error("Server error:", error);
    process.exit(1);
  });
}

startServer(DEFAULT_PORT);
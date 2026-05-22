// backend/config/corsOptions.js
/**
 * CORS configuration:
 *   • Development – allow http://localhost:5173 (Vite dev server)
 *   • Production  – allow the Vercel front‑end URL defined in CLIENT_URL env
 *   • credentials:true to allow cookies / JWT in Authorization header
 */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,               // e.g. https://your-frontend.vercel.app
].filter(Boolean);

module.exports = {
  origin: (origin, callback) => {
    // ‘origin’ may be undefined for same‑origin requests (e.g., curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

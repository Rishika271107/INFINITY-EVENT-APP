const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────────────────────
// Concept: Schema modeling (Mongo) + Relational schema design with PK/FK
//
// In a relational (SQL) database, tables reference each other using Foreign Keys:
//
//   SQL equivalent:
//   ┌──────────────────────────────────────────────┐
//   │  TABLE bookings                              │
//   │  id          INT PRIMARY KEY AUTO_INCREMENT  │
//   │  user_id     INT REFERENCES users(id)        │  ← Foreign Key
//   │  venue_id    INT REFERENCES venues(id)       │  ← Foreign Key (nullable)
//   │  event_date  DATE NOT NULL                   │
//   │  total_amt   DECIMAL NOT NULL                │
//   └──────────────────────────────────────────────┘
//
// In MongoDB (NoSQL), we model the same relationship using ObjectId references.
// The `ref` field tells Mongoose which collection to join when using .populate().
// ObjectId acts as the Primary Key (_id) and the referenced ObjectId acts as
// the Foreign Key equivalent.
//
// MongoDB equivalent of SQL JOIN:
//   Booking.find({ user: userId }).populate('venue')
//   ≈  SELECT * FROM bookings JOIN venues ON bookings.venue_id = venues.id
//        WHERE bookings.user_id = ?
// ─────────────────────────────────────────────────────────────────────────────

const bookingSchema = new mongoose.Schema(
  {
    // Foreign Key → users._id  (like: user_id INT REFERENCES users(id))
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // tells .populate() which collection to join
      required: true,
    },

    // Nullable Foreign Key → venues._id  (like: venue_id INT REFERENCES venues(id))
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",       // used in .populate('venue') queries
    },

    serviceName:  { type: String },
    serviceType:  { type: String },
    eventDate:    { type: Date, required: true },
    totalAmount:  { type: Number, required: true },

    // Flexible key-value store for service-specific details
    // (SQL equivalent: a JSON column or a separate booking_details table)
    bookingDetails: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ENUM columns — exactly like CHECK constraints in SQL
    // SQL: bookingStatus VARCHAR(20) CHECK (bookingStatus IN ('pending','confirmed','cancelled','completed'))
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }   // adds createdAt + updatedAt (like DEFAULT NOW() columns in SQL)
);

// ─── Indexes (SQL equivalent: CREATE INDEX) ───────────────────────────────
// Single-field index: fast lookup of all bookings for a user (like indexed FK)
bookingSchema.index({ user: 1 });

// Single-field index: filter bookings by status efficiently
bookingSchema.index({ bookingStatus: 1 });

// Single-field index: sort by creation date descending (recent first)
bookingSchema.index({ createdAt: -1 });

// Compound index: common admin query — find recent confirmed bookings for a user
// SQL: CREATE INDEX ON bookings(user_id, bookingStatus, createdAt DESC)
bookingSchema.index({ user: 1, bookingStatus: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
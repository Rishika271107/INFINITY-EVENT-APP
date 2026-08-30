# SQL Concepts Reference

> **Note:** The Infinity Event App uses **MongoDB (NoSQL)** as its database.  
> This document demonstrates the equivalent SQL patterns for the same data model,
> covering **Relational schema design with PK/FK** and **SQL JOINs**.

---

## Data Model

The app has three primary entities: **users**, **venues**, and **bookings**.  
In MongoDB these are separate collections linked by `ObjectId` references.  
Below is the equivalent relational SQL schema.

---

## Relational Schema Design with PK/FK

```sql
-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: users
-- Primary Key: id (auto-increment integer)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id                   SERIAL        PRIMARY KEY,
  username             VARCHAR(100)  NOT NULL,
  email                VARCHAR(255)  NOT NULL UNIQUE,   -- UNIQUE constraint
  phone                VARCHAR(20)   NOT NULL,
  password_hash        TEXT          NOT NULL,
  role                 VARCHAR(10)   NOT NULL DEFAULT 'user'
                         CHECK (role IN ('user', 'admin')),
  is_verified          BOOLEAN       NOT NULL DEFAULT FALSE,
  is_blocked           BOOLEAN       NOT NULL DEFAULT FALSE,
  failed_login_attempts INT          NOT NULL DEFAULT 0,
  lock_until           TIMESTAMPTZ,
  last_login           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: venues
-- Primary Key: id
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE venues (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(200)  NOT NULL,
  location    VARCHAR(500),
  price       DECIMAL(12,2) NOT NULL,
  capacity    INT,
  description TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: bookings
-- Primary Key: id
-- Foreign Keys:
--   user_id  → users(id)   [required]
--   venue_id → venues(id)  [optional / nullable]
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id              SERIAL        PRIMARY KEY,

  -- Foreign Key — required (every booking belongs to a user)
  user_id         INT           NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,

  -- Foreign Key — nullable (booking may not have a venue, e.g. photography-only)
  venue_id        INT
                    REFERENCES venues(id) ON DELETE SET NULL,

  service_name    VARCHAR(200),
  service_type    VARCHAR(100),
  event_date      DATE          NOT NULL,
  total_amount    DECIMAL(12,2) NOT NULL,

  -- ENUM-style check constraints (MongoDB uses enum arrays on the schema)
  booking_status  VARCHAR(20)   NOT NULL DEFAULT 'pending'
                    CHECK (booking_status IN ('pending','confirmed','cancelled','completed')),
  payment_status  VARCHAR(20)   NOT NULL DEFAULT 'pending'
                    CHECK (payment_status IN ('pending','paid','failed','refunded')),

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Indexes (same as MongoDB's bookingSchema.index()) ────────────────────────
CREATE INDEX idx_bookings_user_id        ON bookings(user_id);
CREATE INDEX idx_bookings_status         ON bookings(booking_status);
CREATE INDEX idx_bookings_created_at     ON bookings(created_at DESC);
-- Compound index (matches MongoDB compound index)
CREATE INDEX idx_bookings_user_status_dt ON bookings(user_id, booking_status, created_at DESC);
```

---

## SQL JOINs

### INNER JOIN — Get all bookings with user details

Returns only bookings that have a matching user (no orphan rows).

```sql
-- MongoDB equivalent:
--   Booking.find().populate('user', 'username email phone')

SELECT
  b.id              AS booking_id,
  b.service_name,
  b.service_type,
  b.event_date,
  b.total_amount,
  b.booking_status,
  b.payment_status,
  u.username,
  u.email,
  u.phone
FROM bookings b
INNER JOIN users u ON b.user_id = u.id
ORDER BY b.created_at DESC;
```

---

### LEFT JOIN — Get all bookings, including venue details (even if no venue)

Returns all bookings. If a booking has no venue (`venue_id IS NULL`), venue columns are NULL.

```sql
-- MongoDB equivalent:
--   Booking.find({ user: userId }).populate('venue')

SELECT
  b.id              AS booking_id,
  b.service_name,
  b.event_date,
  b.total_amount,
  b.booking_status,
  v.name            AS venue_name,       -- NULL if no venue
  v.location        AS venue_location,   -- NULL if no venue
  v.price           AS venue_price
FROM bookings b
LEFT JOIN venues v ON b.venue_id = v.id
WHERE b.user_id = 42   -- filter by specific user (like req.user._id)
ORDER BY b.created_at DESC;
```

---

### Three-table JOIN — Admin view: bookings with user and venue

```sql
-- MongoDB equivalent:
--   Booking.find().populate('user','username email phone').populate('venue')

SELECT
  b.id              AS booking_id,
  b.service_type,
  b.event_date,
  b.total_amount,
  b.booking_status,
  b.payment_status,
  u.username,
  u.email,
  v.name            AS venue_name,
  v.location
FROM bookings b
INNER JOIN users u  ON b.user_id  = u.id
LEFT  JOIN venues v ON b.venue_id = v.id
ORDER BY b.created_at DESC;
```

---

### Aggregation with JOIN — Total spent per user

```sql
-- MongoDB equivalent (aggregation pipeline):
--   Booking.aggregate([{ $group: { _id: '$user', total: { $sum: '$totalAmount' } } }])

SELECT
  u.username,
  u.email,
  COUNT(b.id)          AS total_bookings,
  SUM(b.total_amount)  AS total_spent
FROM users u
LEFT JOIN bookings b ON b.user_id = u.id AND b.booking_status = 'confirmed'
GROUP BY u.id, u.username, u.email
ORDER BY total_spent DESC NULLS LAST;
```

---

## MongoDB ↔ SQL Quick Reference

| SQL Concept | MongoDB Equivalent |
|---|---|
| `PRIMARY KEY` | `_id` (ObjectId, auto-generated) |
| `FOREIGN KEY REFERENCES users(id)` | `{ type: ObjectId, ref: 'User' }` |
| `JOIN` | `.populate('user')` |
| `INNER JOIN` | `.populate()` (only resolves if ref exists) |
| `LEFT JOIN` | `.populate()` with null-safe handling |
| `WHERE user_id = ?` | `Booking.find({ user: userId })` |
| `CREATE INDEX` | `bookingSchema.index({ user: 1 })` |
| `CHECK (status IN (...))` | `enum: ['pending', 'confirmed', ...]` |
| `DEFAULT NOW()` | `timestamps: true` (mongoose) |
| `GROUP BY + SUM` | `Booking.aggregate([{ $group: ... }])` |

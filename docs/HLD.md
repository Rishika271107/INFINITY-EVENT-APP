# High-Level Design (HLD)
## Infinity Grand Events — System Architecture

**Version:** 1.0.0
**Author:** Rishi
**Last Updated:** August 2026

---

## 1. System Overview

Infinity Grand Events is a three-tier web application consisting of:
1. **React SPA (Frontend)** — Served via Vite dev server or Nginx in production
2. **Express REST API (Backend)** — Node.js application on port 5000
3. **MongoDB (Database)** — Persistent data store (Atlas in production, local in dev)

External integrations include **Razorpay** (payments), **Nodemailer/SMTP** (email notifications), and optionally **Cloudinary** (image uploads).

---

## 2. Architecture Diagram

```
+---------------------+
|    User's Browser   |
|   (React 19 SPA)    |
+----------+----------+
           |  HTTPS / REST API calls
           v
+----------+----------+
|   Express.js API    |  Port 5000
|   (Node.js 18)      |
|                     |
|  Middleware Stack:  |
|  - Helmet (sec)     |
|  - CORS             |
|  - Rate Limiter     |
|  - XSS-Clean        |
|  - Mongo Sanitize   |
|  - JWT Auth         |
|  - Morgan Logger    |
+----+-------+--------+
     |       |
     |       +----> Razorpay API (payments)
     |       +----> SMTP / Nodemailer (email)
     |       +----> Cloudinary (image storage)
     v
+----------+----------+
|    MongoDB Atlas    |
|  Collections:       |
|  - users            |
|  - bookings         |
|  - transactions     |
|  - events           |
|  - venues           |
|  - budgets          |
|  - reminders        |
|  - expenses         |
+---------------------+
```

---

## 3. Deployment Architecture

```
                     [Internet]
                         |
              +----------+----------+
              |       Vercel CDN    |  (Frontend)
              |   React SPA Build   |
              +----------+----------+
                         |  API Calls
              +----------+----------+
              |   Render.com /      |  (Backend)
              |   Docker Container  |
              |   Express API       |
              +----------+----------+
                         |
              +----------+----------+
              |   MongoDB Atlas     |  (Database)
              |   Cloud Cluster     |
              +---------------------+

--- OR via Docker Compose (Local/Self-hosted) ---

  frontend:80  <--> backend:5000  <--> mongo:27017
```

---

## 4. Component Architecture

### 4.1 Frontend Architecture

```
src/
 |-- App.jsx              # Root router with lazy loading
 |-- main.jsx             # React DOM mount
 |-- pages/              # 30+ page components (route-level)
 |   |-- Home            # Landing / marketing page
 |   |-- Auth            # Login, Signup, RoleSelection
 |   |-- UserDashboard   # Main user hub
 |   |-- AdminDashboard  # Admin control panel
 |   |-- Service Pages   # 7 service booking flows
 |   |-- BudgetTracker   # Budget visualization
 |   |-- ReminderPage    # Reminder management
 |   |-- PastActivities  # Booking history
 |   |-- ProfilePage     # User profile
 |   |-- AiHelp          # Tara AI assistant
 |-- components/         # Reusable UI components
 |   |-- Navbar          # Top navigation
 |   |-- UserLayout      # Layout wrapper with sidebar
 |   |-- ProtectedRoute  # Auth guard HOC
 |   |-- Toast           # Notification system
 |   |-- Loader          # Skeleton + spinner
 |   |-- ErrorBoundary   # Error catch UI
 |-- context/            # React Context (global state)
 |   |-- AuthContext     # User session, token, role
 |   |-- AdminContext    # Admin-specific state
 |-- services/           # Axios API layer
 |   |-- api.js          # Configured axios instance
 |-- hooks/              # Custom React hooks
 |-- utils/              # Helper functions
 |-- data/               # Static data (menus, packages)
```

### 4.2 Backend Architecture

```
backend/
 |-- server.js           # Entry point, Express app
 |-- config/
 |   |-- db.js           # MongoDB connection
 |   |-- config.js       # Env validation
 |   |-- corsOptions.js  # CORS whitelist
 |-- routes/             # Route definitions (8 routers)
 |   |-- authRoutes      # /api/auth
 |   |-- eventRoutes     # /api/events
 |   |-- bookingRoutes   # /api/bookings
 |   |-- adminRoutes     # /api/admin
 |   |-- paymentRoutes   # /api/payment
 |   |-- venueRoutes     # /api/venues
 |   |-- budgetRoutes    # /api/budgets
 |   |-- reminderRoutes  # /api/reminders
 |-- controllers/        # Business logic (8 controllers)
 |-- models/             # Mongoose schemas (8 models)
 |-- middleware/         # Express middlewares (6)
 |   |-- authMiddleware  # JWT verification
 |   |-- errorMiddleware # Global error handler
 |   |-- rateLimiter     # Per-route rate limits
 |   |-- validate        # Request validation
 |-- services/
 |   |-- emailService    # Nodemailer wrapper
 |-- utils/
 |   |-- logger          # Winston logger
 |   |-- generateToken   # JWT factory
 |-- scripts/
 |   |-- seedUsers       # Seed admin + test users
 |-- validationSchemas/  # Joi/Zod schemas
```

---

## 5. Security Architecture

| Layer | Security Control |
|-------|-----------------|
| Network | HTTPS (TLS via Vercel/Render), CORS whitelist |
| Application | Helmet (15 HTTP security headers), XSS-Clean |
| Database | Mongo-Sanitize (NoSQL injection prevention) |
| Authentication | JWT RS256-signed tokens, bcrypt password hashing (saltRounds=10) |
| Rate Limiting | 100 requests / 15 minutes per IP (global + per-route) |
| Brute Force | Account lock for 30 min after 5 failed login attempts |
| Payload | JSON body limited to 10kb |
| Trust Proxy | Enabled for correct IP behind Render/Railway proxies |

---

## 6. Data Flow — Booking & Payment

```
[User selects service] 
       |
[Frontend builds booking object]
       |
POST /api/bookings/create  -->  [bookingController creates Booking (status: pending)]
       |
[Frontend receives bookingId]
       |
POST /api/payment/create-order  -->  [paymentController calls Razorpay API]
       |
[Razorpay returns order_id]
       |
[Frontend opens Razorpay Checkout UI]
       |
[User completes payment]
       |
POST /api/payment/verify  -->  [HMAC-SHA256 signature check]
       |
[Booking status -> confirmed, paymentStatus -> paid]
       |
[Transaction record logged]
       |
[Frontend shows /booking-success page]
       |
[Razorpay Webhook (async)] --> background sync fallback
```

---

## 7. API Design Summary

| Domain | Base Route | Methods |
|--------|-----------|---------|
| Auth | /api/auth | POST /register, POST /login, GET /profile, PUT /profile |
| Events | /api/events | GET /, POST /, GET /:id, PUT /:id, DELETE /:id |
| Bookings | /api/bookings | POST /, GET /my-bookings, GET /:id, PATCH /:id/cancel |
| Payment | /api/payment | POST /create-order, POST /verify, POST /retry, POST /refund, POST /webhook |
| Venues | /api/venues | GET /, GET /:id |
| Budget | /api/budgets | GET /, POST /, PUT / |
| Reminders | /api/reminders | GET /, POST /, DELETE /:id |
| Admin | /api/admin | GET /stats, GET /users, GET /vendors, GET /transactions |

---

## 8. State Management

The frontend uses **React Context** (no external state library):
- **AuthContext** — Stores JWT token, decoded user object (id, username, email, role), login/logout actions
- **AdminContext** — Stores admin-fetched data (bookings, users, vendors, revenue) for the dashboard
- Service booking flows use **local component state** + **React Router navigation** to pass data across steps

---

## 9. Scalability Considerations

| Concern | Approach |
|---------|---------|
| Frontend performance | React.lazy + Suspense for code splitting all page components |
| API performance | MongoDB indexes on user, bookingStatus, createdAt |
| DB connections | Mongoose connection pooling |
| Horizontal scaling | Stateless JWT auth; Docker-ready; no server-side sessions |
| Log management | Winston daily-rotate-file prevents disk overflow |
| Deployment | Vercel edge CDN for frontend; Render auto-scaling for API |

---

## 10. External Integrations

| Service | Purpose | Auth Method |
|---------|---------|-------------|
| Razorpay | Payment processing & refunds | API Key + Secret (env vars) |
| Nodemailer + SMTP | Email reminders and notifications | SMTP credentials (env vars) |
| Cloudinary | Image/media storage (future) | API Key (env vars) |
| MongoDB Atlas | Cloud database | Connection string (env vars) |

# Low-Level Design (LLD)
## Infinity Grand Events — Detailed Technical Specification

**Version:** 1.0.0
**Author:** Rishi
**Last Updated:** August 2026

---

## 1. Database Schema (Mongoose Models)

### 1.1 User Model (`/backend/models/User.js`)

| Field | Type | Constraints | Default |
|-------|------|------------|---------|
| _id | ObjectId | auto | - |
| username | String | required | - |
| email | String | required, unique | - |
| phone | String | required | - |
| password | String | required, bcrypt hashed | - |
| role | String | enum: ['user','admin'] | 'user' |
| isVerified | Boolean | - | false |
| isBlocked | Boolean | - | false |
| failedLoginAttempts | Number | - | 0 |
| lockUntil | Date | - | null |
| lastLogin | Date | - | - |
| createdAt | Date | timestamps | - |
| updatedAt | Date | timestamps | - |

**Indexes:** email (unique)

---

### 1.2 Booking Model (`/backend/models/Booking.js`)

| Field | Type | Constraints | Default |
|-------|------|------------|---------|
| _id | ObjectId | auto | - |
| user | ObjectId | ref: User, required | - |
| venue | ObjectId | ref: Venue | - |
| serviceName | String | - | - |
| serviceType | String | - | - |
| eventDate | Date | required | - |
| totalAmount | Number | required | - |
| bookingDetails | Map<Mixed> | flexible KV store | {} |
| bookingStatus | String | enum: [pending, confirmed, cancelled, completed] | 'pending' |
| paymentStatus | String | enum: [pending, paid, failed, refunded] | 'pending' |
| razorpay_order_id | String | - | - |
| razorpay_payment_id | String | - | - |
| razorpay_signature | String | - | - |
| createdAt | Date | timestamps | - |

**Indexes:** `{ user: 1 }`, `{ bookingStatus: 1 }`, `{ createdAt: -1 }`

---

### 1.3 Transaction Model (`/backend/models/Transaction.js`)

| Field | Type | Constraints | Default |
|-------|------|------------|---------|
| _id | ObjectId | auto | - |
| booking | ObjectId | ref: Booking, required | - |
| user | ObjectId | ref: User, required | - |
| amount | Number | required | - |
| currency | String | - | 'INR' |
| paymentMethod | String | - | 'unknown' |
| razorpay_order_id | String | required | - |
| razorpay_payment_id | String | - | - |
| razorpay_signature | String | - | - |
| razorpayOrderId | String | backward compat | - |
| razorpayPaymentId | String | backward compat | - |
| razorpaySignature | String | backward compat | - |
| status | String | enum: [pending, success, failed] | 'pending' |
| receipt | String | - | - |
| createdAt | Date | timestamps | - |

---

### 1.4 Event Model (`/backend/models/Event.js`)

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | auto |
| title | String | required |
| description | String | required |
| date | Date | required |
| location | String | required |
| price | Number | required |
| image | String | optional |
| createdBy | ObjectId | ref: User |

---

### 1.5 Venue Model (`/backend/models/Venue.js`)

| Field | Type | Default |
|-------|------|---------|
| _id | ObjectId | auto |
| name | String | required |
| city | String | required |
| rating | Number | 5 |
| reviews | Number | 0 |
| price | Number | required |
| imageUrl | String | optional |

---

### 1.6 Budget Model (`/backend/models/Budget.js`)

| Field | Type | Default |
|-------|------|---------|
| _id | ObjectId | auto |
| user | ObjectId | ref: User, unique |
| budgetLimit | Number | 1000000 |
| spentAmount | Number | 0 |
| remainingAmount | Number | 1000000 |

**Constraint:** One budget document per user (unique index on `user`)

---

### 1.7 Reminder Model (`/backend/models/Reminder.js`)

| Field | Type | Constraints |
|-------|------|------------|
| _id | ObjectId | auto |
| user | ObjectId | ref: User, required |
| eventName | String | required |
| date | String | required |
| time | String | required |

---

### 1.8 Expense Model (`/backend/models/Expense.js`)

Tracks individual expense entries linked to bookings for budget breakdown.

---

## 2. API Endpoints — Detailed Specification

### 2.1 Auth Routes (`/api/auth`)

| Method | Endpoint | Auth | Body | Response |
|--------|---------|------|------|---------|
| POST | /register | None | {username, email, phone, password} | {success, message} |
| POST | /login | None | {email, password} | {success, token, user} |
| GET | /profile | JWT (user/admin) | - | {success, user} |
| PUT | /profile | JWT (user/admin) | {username?, phone?} | {success, user} |

**Validation Rules (register):**
- email: valid format, trimmed + lowercased
- password: min 6 characters
- All 4 fields required

**Login Security Logic:**
```
1. Find user by email
2. Check lockUntil expired -> reset lock
3. Check isBlocked -> 403
4. Check lockUntil active -> 403
5. bcrypt.compare(password, hash)
6. On fail: increment failedLoginAttempts
7. On 5 fails: set isBlocked=true, lockUntil=now+30min
8. On success: reset counters, generate JWT, return token
```

---

### 2.2 Booking Routes (`/api/bookings`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | / | JWT user | Create new booking |
| GET | /my-bookings | JWT user | Get all bookings for current user |
| GET | /:id | JWT user | Get single booking detail |
| PATCH | /:id/cancel | JWT user | Cancel a booking |

**Booking Creation Logic:**
```
1. Validate eventDate, totalAmount, serviceName
2. Create Booking with status: pending, paymentStatus: pending
3. Return bookingId for payment initiation
```

---

### 2.3 Payment Routes (`/api/payment`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | /create-order | JWT user | Create Razorpay order from bookingId |
| POST | /verify | JWT user | Verify Razorpay signature + confirm booking |
| POST | /retry | JWT user | Retry failed payment |
| POST | /refund | JWT admin | Issue refund via Razorpay API |
| POST | /webhook | None (sig check) | Razorpay webhook handler |

**Payment Verification Algorithm:**
```
signPayload = razorpay_order_id + "|" + razorpay_payment_id
expectedSignature = HMAC-SHA256(RAZORPAY_KEY_SECRET, signPayload)
if (razorpay_signature === expectedSignature):
    -> update Transaction: status=success
    -> update Booking: paymentStatus=paid, bookingStatus=confirmed
else:
    -> update Transaction: status=failed
    -> update Booking: paymentStatus=failed
```

---

### 2.4 Admin Routes (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | /stats | JWT admin | Dashboard overview metrics |
| GET | /users | JWT admin | All registered users + booking counts |
| GET | /vendors | JWT admin | Active platform vendors |
| GET | /transactions | JWT admin | Full transaction history |

**Stats Aggregation:**
```javascript
totalUsers = User.countDocuments({ role: "user" })
totalBookings = Booking.countDocuments()
pendingBookings = Booking.countDocuments({ bookingStatus: "pending" })
totalRevenue = Booking.aggregate([
  { $match: { bookingStatus: { $ne: "cancelled" } } },
  { $group: { _id: null, total: { $sum: "$totalAmount" } } }
])
```

---

## 3. Frontend Component Details

### 3.1 Authentication Context (`AuthContext.jsx`)

**State Shape:**
```javascript
{
  user: { id, username, email, phone, role } | null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean
}
```

**Key Methods:**
- `login(userData, token)` — Store token in localStorage, set user state
- `logout()` — Clear localStorage, reset state, redirect to home
- `isAdmin()` — Returns true if user.role === 'admin'

---

### 3.2 Protected Route HOC (`ProtectedRoute.jsx`)

```javascript
function ProtectedRoute({ role, children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) -> redirect /user/login
  if (role === 'admin' && user.role !== 'admin') -> redirect /
  return children
}
```

---

### 3.3 Axios API Service (`services/api.js`)

- Base URL configured from VITE_API_URL env variable
- Request interceptor: auto-attaches `Authorization: Bearer <token>` header
- Response interceptor: handles 401 (redirect to login)

---

### 3.4 Service Booking Flow Pattern

Each of the 7 services follows the same 3-step multi-page flow:

```
Step 1: Details/Browse Page
  -> User views options, selects preferences
  -> State passed via React Router navigate(path, { state: data })

Step 2: Selection/Customization Page
  -> User refines choice (package, date, count)
  -> Builds bookingPayload object

Step 3: Confirmation Page
  -> Displays full booking summary
  -> POST /api/bookings -> get bookingId
  -> POST /api/payment/create-order -> get Razorpay order
  -> Open Razorpay Checkout
  -> On success: POST /api/payment/verify
  -> Navigate to /booking-success
```

---

### 3.5 AI Assistant ("Tara") — Intent Engine

```javascript
const detectIntent = (userInput) => {
  // Keyword pattern matching
  if (includes "decoration") -> "VENUE_DECOR"
  if (includes "color/palette") -> "COLORS"
  if (includes "saree/outfit") -> "SAREE_STYLING"
  if (includes "fashion/style") -> "FASHION"
  if (includes "budget/cost") -> "BUDGET"
  if (includes "wedding planning") -> "WEDDING_PLANNING"
  if (includes "confused/stressed") -> "EMOTIONAL_SUPPORT"
  if (includes "photography") -> "PHOTOGRAPHY"
  if (includes "catering/food") -> "CATERING"
  if (includes "entertainment/music") -> "ENTERTAINMENT"
  else -> "GENERAL"
}

// Session memory tracks:
{ eventType, culture, outfit, timing, style, color, venue }
```

**Response Generator:** Returns curated multi-paragraph responses per intent with event planning context, suggestions, and platform feature links.

---

### 3.6 Admin Dashboard Sections

The AdminDashboard lazy-loads 5 section components from AdminSections.jsx:

| Section | Data Source | Features |
|---------|------------|---------|
| BookingsSection | GET /api/admin (bookings) | Table view, status filter, confirm/cancel actions |
| UsersSection | GET /api/admin/users | User list, booking count, status badge |
| VendorsSection | GET /api/admin/vendors | Vendor cards, service type, rating |
| RevenueSection | GET /api/admin/stats | Revenue cards, booking trends |
| SettingsSection | Local state | Platform settings UI |

---

## 4. Middleware Stack (Backend)

### 4.1 authMiddleware.js

```javascript
1. Extract token from Authorization header (Bearer scheme)
2. jwt.verify(token, JWT_SECRET)
3. Find user by decoded._id in DB
4. Check user.isBlocked -> 403
5. Attach user object to req.user
6. Call next()
```

### 4.2 validate.js

```javascript
// Wraps Joi/Zod schemas
validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) -> 400 with validation message
    else next()
  }
}
```

### 4.3 rateLimiter.js

- Global: 100 requests / 15 min per IP
- Auth-specific: stricter limits on /api/auth/login

### 4.4 failedLoginLock.js

Tracks and enforces account lockout logic at middleware level.

---

## 5. Error Handling Strategy

### Frontend
- `ErrorBoundary` component wraps entire app — catches render errors
- Axios interceptors catch API errors globally
- Toast notifications display user-facing error messages
- Each page component has local try/catch with loading/error states

### Backend
- All controllers wrapped in try/catch
- Global error middleware at end of middleware stack:
  ```javascript
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error"
    })
  })
  ```
- Winston logger captures all errors with timestamps and stack traces
- 404 catch-all for undefined /api/* routes

---

## 6. Token & Session Management

| Aspect | Implementation |
|--------|---------------|
| Token Type | JWT (JSON Web Token) |
| Token Payload | `{ id: userId }` |
| Expiration | 7 days (configurable via JWT_EXPIRES_IN) |
| Storage | localStorage (client-side) |
| Transmission | Authorization: Bearer header on all API calls |
| Refresh | Manual re-login on expiry |
| Invalidation | Client-side logout (token removal; no server-side blacklist in v1) |

---

## 7. Email Service (`services/emailService.js`)

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
})

sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: EMAIL_USER,
    to, subject, html
  })
}
```

Used by: reminderController to send reminder notification emails.

---

## 8. Logging Architecture

| Logger | Purpose | Output |
|--------|---------|--------|
| Winston | Application events, errors, auth events | Daily rotating log files in /logs |
| Morgan | HTTP request access log | Console + Winston stream |
| console.error | Debug logs (dev) | Console only |

**Log Levels:** error, warn, info, http, debug

**Log Files:**
- `logs/combined.log` — All logs
- `logs/error.log` — Error logs only
- Auto-rotated daily, max 14 days retention

---

## 9. Build & Deployment

### Frontend Build
```
npm run build  (in /frontend)
-> Vite bundles React app to /dist
-> Code-split chunks per lazy-loaded page
-> Static served via Vercel or Nginx
```

### Backend Start
```
npm start  (in /backend)
-> Loads .env variables
-> Validates env with config.js
-> Connects to MongoDB (with IPv4 DNS preference)
-> Seeds admin user if not exists
-> Starts Express server (auto port if 5000 busy)
```

### Docker Compose (Full Stack)
```yaml
services:
  frontend: build ./frontend, port 80
  backend: build ./backend, port 5000
  mongo: image mongo:6.0, port 27017, persistent volume
```

---

## 10. Testing Strategy

### Backend (Jest + Supertest)
- Unit tests for controllers (mocked MongoDB via mongodb-memory-server)
- Integration tests for auth flow (register, login, protected routes)
- Payment controller tests with mocked Razorpay

### Frontend (Vitest + Testing Library)
- Component unit tests
- Custom hook tests
- API service mock tests (MSW)

**Run Commands:**
```bash
# Backend tests
cd backend && npm test

# Frontend tests (if configured)
cd frontend && npx vitest
```

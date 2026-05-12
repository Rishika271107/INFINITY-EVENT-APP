<<<<<<< HEAD
# 🌟 Infinity Grand Events — Backend API

AI-powered luxury event management platform backend built with Node.js, Express, and MongoDB.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
# Edit .env file with your MongoDB URI and JWT secrets

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

The API will be running at `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── config/           # Database & Cloudinary configuration
├── constants/        # Centralized enums & constants
├── controllers/      # Route handlers (business logic)
├── middleware/        # Auth, role, error, upload, validation
├── models/           # Mongoose schemas (User, Vendor, Booking, Budget)
├── routes/           # Express route definitions
├── services/         # Business logic services (future)
├── sockets/          # Socket.IO real-time setup
├── utils/            # Helpers (asyncHandler, ApiError, sendResponse, generateToken)
├── validations/      # express-validator rule sets
├── uploads/          # Local file uploads
├── logs/             # Application logs
├── app.js            # Express app configuration
├── server.js         # Server entry point
├── .env              # Environment variables
└── package.json      # Dependencies & scripts
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | `development` or `production` | No |
| `MONGO_URI` | MongoDB Atlas connection string | **Yes** |
| `JWT_SECRET` | JWT access token secret | **Yes** |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | **Yes** |
| `JWT_EXPIRES_IN` | Access token expiry (default: `1d`) | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry (default: `7d`) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |
| `FRONTEND_URL` | Frontend URL for CORS (default: `http://localhost:5173`) | No |

---

## 🛡️ Security Features

- **JWT Authentication** with access + refresh tokens
- **Role-Based Authorization** (user, vendor, admin)
- **Helmet** HTTP security headers
- **CORS** with credentials support
- **Rate Limiting** (100 req/15min API, 20 req/15min auth)
- **MongoDB Injection Protection** via express-mongo-sanitize
- **XSS Protection** via xss-clean
- **Input Validation** via express-validator
- **Password Hashing** with bcryptjs (12 rounds)
- **Cookie-based tokens** with httpOnly, secure, sameSite

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/logout` | Private | Logout user |
| GET | `/profile` | Private | Get current profile |
| POST | `/refresh-token` | Public | Refresh access token |
| PUT | `/change-password` | Private | Change password |
| POST | `/forgot-password` | Public | Request password reset |
| POST | `/reset-password` | Public | Reset password with token |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/profile` | Private | Get own profile |
| PUT | `/profile` | Private | Update profile (+ image) |
| DELETE | `/profile` | Private | Delete own account |
| PUT | `/favorites/:vendorId` | Private | Add vendor to favorites |
| DELETE | `/favorites/:vendorId` | Private | Remove from favorites |
| GET | `/` | Admin | Get all users (paginated) |
| GET | `/:id` | Admin | Get user by ID |
| PUT | `/:id/block` | Admin | Toggle block user |
| DELETE | `/:id` | Admin | Delete user |

### Vendors (`/api/vendors`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List vendors (filter/sort/paginate) |
| GET | `/:id` | Public | Get vendor details |
| GET | `/my-vendors` | Vendor/Admin | Get own vendor profiles |
| POST | `/` | Vendor/Admin | Create vendor (+ images) |
| PUT | `/:id` | Owner/Admin | Update vendor |
| DELETE | `/:id` | Owner/Admin | Delete vendor |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create booking |
| GET | `/my-bookings` | Private | Get own bookings |
| GET | `/` | Admin | Get all bookings |
| GET | `/:id` | Owner/Admin | Get booking details |
| PUT | `/:id` | Owner/Admin | Update booking |
| DELETE | `/:id` | Owner/Admin | Cancel booking |

### Budget (`/api/budget`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get user budgets |
| POST | `/` | Private | Create budget |
| PUT | `/:id` | Private | Update budget |
| DELETE | `/:id` | Private | Delete budget |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Admin | Dashboard analytics |
| GET | `/users` | Admin | All users (paginated) |
| GET | `/vendors` | Admin | All vendors (inc. unapproved) |
| PUT | `/vendors/:id/approve` | Admin | Approve vendor |
| PUT | `/vendors/:id/feature` | Admin | Toggle featured vendor |
| GET | `/bookings` | Admin | All bookings (paginated) |

---

## 🧪 Testing with Postman

### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Booking (requires Bearer token)
```
POST http://localhost:5000/api/bookings
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "vendor": "<vendor_id>",
  "eventType": "Wedding",
  "eventDate": "2026-12-25",
  "guestCount": 200,
  "totalPrice": 150000,
  "specialRequest": "Outdoor ceremony with floral arch"
}
```

### Create Vendor (requires Bearer token — vendor/admin role)
```
POST http://localhost:5000/api/vendors
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

businessName: Royal Caterers
category: Catering
description: Premium catering services for luxury events
pricing: {"basePrice": 50000, "currency": "INR", "packages": [{"name": "Gold", "price": 75000, "description": "Full service catering"}]}
location: {"city": "Hyderabad", "state": "Telangana", "address": "123 Main St"}
contact: {"phone": "9876543210", "email": "info@royalcaterers.com"}
images: [file upload]
```

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| `user` | Default role. Can book events, manage profile, save favorites |
| `vendor` | Can create/manage vendor profiles and view their bookings |
| `admin` | Full access. Manage users, approve vendors, view analytics |

---

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcryptjs
- **Uploads:** Multer + Cloudinary
- **Security:** Helmet, CORS, Rate Limiting, Mongo Sanitize, XSS Clean
- **Validation:** express-validator
- **Real-time:** Socket.IO (scaffolded)
- **Logging:** Morgan

---

## 📄 License

ISC
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> b343248aed731431e4c1e37b6fa8f349daaaa6c2

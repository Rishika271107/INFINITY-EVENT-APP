# Product Requirements Document (PRD)
## Infinity Grand Events — End-to-End Event Management Platform

**Version:** 1.0.0
**Author:** Rishi
**Last Updated:** August 2026
**Status:** Active Development

---

## 1. Executive Summary

**Infinity Grand Events** is a full-stack, multi-role event management web application that enables users to plan, book, and manage every aspect of an event — from venue selection and catering to photography, fashion, makeup, decoration, and tourist experiences — all under one roof. An admin panel provides operational oversight, revenue tracking, and vendor management. A built-in AI assistant ("Tara") offers personalized event planning guidance.

---

## 2. Problem Statement

Planning a major event (wedding, birthday, corporate event) in India involves coordinating across dozens of vendors, services, and timelines independently. Users lack:
- A single platform to browse, compare, and book all event services.
- Real-time budget tracking against booked services.
- A centralized communication and reminder system.
- Intelligent guidance for style, decor, and planning decisions.

---

## 3. Goals & Objectives

| Goal | Success Metric |
|------|----------------|
| Consolidate all event services into one platform | Users book >= 2 services per event session |
| Enable secure online payments | Razorpay payment success rate > 95% |
| Provide personalized event guidance | AI assistant session engagement > 3 min avg |
| Reduce admin workload | Dashboard gives real-time stats with 0 manual queries |
| Ensure security & reliability | Zero critical auth vulnerabilities; <200ms API response |

---

## 4. Target Users

### 4.1 End Users (Event Planners)
- Individuals planning weddings, birthdays, or cultural events
- Families coordinating multi-vendor bookings
- Corporate clients managing events

### 4.2 Administrators
- Platform operators managing the entire service ecosystem
- Staff reviewing and confirming bookings
- Finance team tracking revenue and refunds

---

## 5. User Roles & Permissions

| Feature | Guest | User | Admin |
|---------|-------|------|-------|
| View Home Page | Yes | Yes | Yes |
| Register / Login | Yes | Yes | Yes |
| Browse & Book Services | No | Yes | Yes |
| Budget Tracker | No | Yes | Yes |
| Reminder Management | No | Yes | Yes |
| Past Activities | No | Yes | Yes |
| Profile Management | No | Yes | Yes |
| AI Event Assistant | No | Yes | Yes |
| Admin Dashboard | No | No | Yes |
| User Management | No | No | Yes |
| Vendor Management | No | No | Yes |
| Revenue Analytics | No | No | Yes |
| Issue Refunds | No | No | Yes |

---

## 6. Core Features

### 6.1 Authentication & Security
- **User Registration** — Username, email, phone, password (bcrypt hashed)
- **User Login** — JWT-based authentication
- **Admin Login** — Separate credential set with admin-role JWT
- **Brute-Force Protection** — Account locked for 30 min after 5 failed login attempts
- **Role-Based Access Control** — ProtectedRoute HOC enforces user/admin separation
- **Auto-Verification** — Users are auto-verified on registration

### 6.2 User Dashboard
- Quick-access cards for all 7 event services
- Navigation to profile, budget tracker, reminders, and past activities
- Personalized greeting with user name

### 6.3 Service Booking Flows (7 Services)

#### 6.3.1 Food Supply
- Browse partner hotels/caterers
- View detailed food menu by hotel (per-item pricing)
- Cart-style food checkout with quantity selection
- Booking confirmation with total calculation

#### 6.3.2 Venue Booking
- Browse venue listings with ratings, reviews, city, and pricing
- Venue detail page with amenities and imagery
- Venue selection and confirmation flow
- Razorpay payment integration on confirmation

#### 6.3.3 Fashion Designing
- Browse fashion design packages and styles
- Select outfit preferences
- Confirm booking with designer assignment

#### 6.3.4 Photography
- View photography packages and service details
- Select photographer/package
- Confirm booking with date and pricing

#### 6.3.5 Tourist Experience
- Browse tourist destinations/places
- View partner hotels at each location
- Confirm tour booking with travel details

#### 6.3.6 Makeup Services
- Browse makeup artist packages
- Confirm makeup booking with preferences

#### 6.3.7 Decoration
- Browse decoration styles and vendors
- Select vendor and decoration package
- Confirm decoration booking

### 6.4 Payment System (Razorpay)
- Create Razorpay order from pending booking
- Launch Razorpay Checkout UI
- Signature verification via HMAC-SHA256
- Booking status auto-updated on payment success/failure
- Payment retry for failed transactions
- Admin-initiated refunds
- Webhook listener for background sync

### 6.5 Budget Tracker
- User-defined budget limit (default: Rs. 10,00,000)
- Auto-tracks spent amount from confirmed bookings
- Displays remaining budget
- Visual spending breakdown

### 6.6 Reminder System
- Create reminders with event name, date, and time
- Email reminder notification via Nodemailer
- View and manage all active reminders

### 6.7 Past Activities
- View full history of all bookings across services
- Filter by service type and booking status
- Shows booking date, amount, and current status

### 6.8 Profile Management
- View account details (username, email, phone)
- Edit username and phone number
- Displays role and account creation date

### 6.9 AI Event Assistant ("Tara")
- Rule-based conversational AI with intent detection
- Handles: venue decor, color palettes, saree styling, fashion, budget planning, wedding planning, photography, catering, entertainment
- Session memory for contextual multi-turn conversation
- Emotional support responses for stressed planners

### 6.10 Admin Dashboard
- Overview Stats: Total bookings, total revenue, registered users, active vendors, pending orders
- Bookings Section: All bookings with user, service, status, date, amount
- Users Section: All registered users with booking count and status
- Vendors Section: Platform vendors with service type, city, rating, booking count
- Revenue Section: Revenue analytics and financial overview
- Settings Section: Platform configuration

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | API response < 200ms for CRUD, < 500ms for aggregates |
| Security | Helmet, XSS-Clean, Mongo-Sanitize, Rate Limiting (100 req/15 min) |
| Scalability | Docker-containerized; MongoDB Atlas-ready |
| Reliability | Global error boundary on frontend; centralized error middleware on backend |
| Logging | Winston with daily log rotation; Morgan HTTP access logging |
| SEO | Meta tags, semantic HTML, proper title hierarchy |
| Accessibility | ARIA labels, keyboard navigation support |
| Responsiveness | Mobile-first CSS, responsive layouts across all breakpoints |

---

## 8. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, React Router 7, Axios |
| Styling | Vanilla CSS (custom design system), Lucide React icons |
| Forms | React Hook Form + Zod validation |
| Backend | Node.js, Express 4, MongoDB, Mongoose 8 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Payments | Razorpay |
| Email | Nodemailer |
| Deployment | Docker + Docker Compose, Vercel (frontend), Render (backend) |
| Logging | Winston, Morgan |
| Testing | Jest + Supertest (backend), Vitest + Testing Library (frontend) |

---

## 9. User Flows

### 9.1 New User Journey
```
Landing Page -> Role Selection -> Signup -> Login -> User Dashboard
-> Select Service -> Browse -> Select -> Confirm -> Pay (Razorpay) -> Booking Success
```

### 9.2 Admin Journey
```
Admin Login -> Admin Dashboard -> Review Bookings / Users / Vendors / Revenue
-> Confirm/Cancel Bookings -> Issue Refunds
```

### 9.3 AI Assistant Journey
```
User Dashboard -> AI Help ("Tara") -> Type event type/question
-> Receive contextual guidance -> Navigate to relevant service
```

---

## 10. Out of Scope (v1.0)

- Real-time vendor chat/messaging
- Multi-language support
- Native mobile app (iOS/Android)
- Vendor self-onboarding portal
- Social media sharing of bookings
- Event RSVP/guest management

---

## 11. Success Criteria

- All 7 service booking flows complete end-to-end without errors
- Razorpay payment + verification cycle works in test mode
- Admin dashboard displays live DB stats
- Budget tracker correctly reflects confirmed booking totals
- Reminder emails are delivered via Nodemailer
- All routes are protected by role-based auth

# Infinity Grand Events API - Postman Testing Guide

This document contains sample JSON bodies and endpoint details for testing the backend APIs via Postman.

## Base URL
`http://localhost:5000`

---

## 1. Authentication (`/api/auth`)

### Signup User
**POST** `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
*Note: To create an admin, add `"role": "admin"` to the JSON.*

### Login User
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
*Response will contain a `token`. Use this token in the Headers for Private routes.*
`Header: Authorization = Bearer <token>`

### Change Password (Private)
**PUT** `/api/auth/change-password`
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

## 2. User Management (`/api/users`)

### Get Profile (Private)
**GET** `/api/users/profile`

### Update Profile (Private)
**PUT** `/api/users/profile`
*Use form-data if uploading an image.*
- `name`: "John Updated"
- `email`: "john.updated@example.com"
- `profileImage`: (File)

### Get All Users (Admin Only)
**GET** `/api/users`

### Block/Unblock User (Admin Only)
**PUT** `/api/users/:id/block`

---

## 3. Vendors (`/api/vendors`)

### Get All Vendors (Public)
**GET** `/api/vendors?category=Decoration&sort=priceAsc`

### Create Vendor (Admin Only)
**POST** `/api/vendors`
*Use form-data if uploading an image.*
- `name`: "Elegant Decorators"
- `category`: "Decoration"
- `price`: 5000
- `location`: "New York"
- `description`: "Premium wedding decorations."
- `contact`: "123-456-7890"
- `image`: (File)

---

## 4. Bookings (`/api/bookings`)

### Create Booking (Private)
**POST** `/api/bookings`
```json
{
  "vendor": "65ab1c2d3e4f5g6h7i8j9k0l",
  "eventDate": "2024-12-25T00:00:00.000Z",
  "guests": 150,
  "totalPrice": 5000
}
```

### Get My Bookings (Private)
**GET** `/api/bookings/mybookings`

### Update Booking Status (Admin Only)
**PUT** `/api/bookings/:id/status`
```json
{
  "bookingStatus": "confirmed",
  "paymentStatus": "paid"
}
```

---

## 5. Budget Planner (`/api/budget`)

### Create Budget (Private)
**POST** `/api/budget`
```json
{
  "totalBudget": 20000,
  "eventType": "Wedding"
}
```

### Update Budget - Add Expense (Private)
**PUT** `/api/budget/:id`
```json
{
  "spentAmount": 1500
}
```

### Get My Budgets (Private)
**GET** `/api/budget`

// backend/tests/bookings/getBookings.test.js
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const { createTestUser } = require('../utils/createTestUser');
const { generateToken } = require('../utils/generateToken');

async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
}

describe('GET /api/bookings/my-bookings - User bookings fetch', () => {
  let user, admin, token;

  beforeEach(async () => {
    await clearDatabase();
    user = await createTestUser({ email: 'user@example.com', role: 'user' });
    admin = await createTestUser({ email: 'admin@example.com', role: 'admin' });
    token = generateToken({ id: user._id, role: user.role });
  });

  test('user should fetch only their own bookings, sorted desc by createdAt', async () => {
    // create two bookings for user and one for admin
    const b1 = await Booking.create({ user: user._id, residentialArea: 'A', eventDate: '2024-01-01', totalAmount: 100 });
    const b2 = await Booking.create({ user: user._id, residentialArea: 'B', eventDate: '2024-02-01', totalAmount: 200 });
    await Booking.create({ user: admin._id, residentialArea: 'C', eventDate: '2024-03-01', totalAmount: 300 });

    const res = await request(app)
      .get('/api/bookings/my-bookings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('bookings');
    const bookings = res.body.bookings;
    // Should return exactly 2 bookings, newest first
    expect(bookings).toHaveLength(2);
    expect(new Date(bookings[0].createdAt) > new Date(bookings[1].createdAt)).toBeTruthy();
    // Ensure they belong to user
    bookings.forEach(b => expect(b.user).toBe(user._id.toString()));
  });

  test('admin should fetch all bookings via admin route', async () => {
    const adminToken = generateToken({ id: admin._id, role: admin.role });
    // create some bookings
    await Booking.create({ user: user._id, residentialArea: 'A', eventDate: '2024-01-01', totalAmount: 100 });
    await Booking.create({ user: admin._id, residentialArea: 'B', eventDate: '2024-02-01', totalAmount: 200 });

    const res = await request(app)
      .get('/api/bookings/all')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('bookings');
    expect(res.body.bookings).toHaveLength(2);
  });

  test('unauthorized request should be rejected', async () => {
    const res = await request(app).get('/api/bookings/my-bookings');
    expect(res.statusCode).toBe(401);
  });

  test('invalid token should be rejected', async () => {
    const res = await request(app)
      .get('/api/bookings/my-bookings')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });

  test('role-based restriction: non‑admin cannot access /api/bookings/all', async () => {
    const res = await request(app)
      .get('/api/bookings/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});

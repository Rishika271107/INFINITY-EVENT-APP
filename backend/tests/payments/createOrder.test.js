// backend/tests/payments/createOrder.test.js
const request = require('supertest');
const app = require('../../server'); // Express app
const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const Venue = require('../../models/Venue');
const { createTestUser } = require('../utils/createTestUser');
const { generateToken } = require('../utils/generateToken');

// Mock Razorpay library - production‑grade mock
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => {
    return {
      orders: {
        create: jest.fn().mockResolvedValue({
          id: 'order_test_123',
          amount: 5000,
          currency: 'INR',
          receipt: 'receipt_test_001',
        }),
      },
      payments: {
        fetch: jest.fn().mockResolvedValue({ method: 'card' }),
      },
    };
  });
});

/** Helper to wipe DB between tests */
async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
}

describe('POST /api/payment/create-order - Razorpay Order Creation', () => {
  let user, admin, token, venue;

  beforeAll(async () => {
    // ensure connection (globalSetup does this)
  });

  beforeEach(async () => {
    await clearDatabase();
    user = await createTestUser({ email: 'payer@example.com', role: 'user' });
    admin = await createTestUser({ email: 'admin@example.com', role: 'admin' });
    token = generateToken({ id: user._id, role: user.role });
    venue = await Venue.create({ name: 'Test Venue', price: 1000, location: 'City', capacity: 200 });
  });

  const endpoint = '/api/payment/create-order';

  test('should create Razorpay order for a valid pending booking', async () => {
    // Create a pending booking linked to the user
    const booking = await Booking.create({
      user: user._id,
      venue: venue._id,
      residentialArea: 'Downtown',
      eventDate: '2025-12-10',
      startTime: '18:00',
      durationHours: 3,
      guestCount: 50,
      totalAmount: 1500,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });

    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ bookingId: booking._id.toString() });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('order_id', 'order_test_123');
    // Booking should now hold razorpay_order_id
    const updated = await Booking.findById(booking._id).lean();
    expect(updated.razorpay_order_id).toBe('order_test_123');
  });

  test('should reject when bookingId is missing', async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject unauthenticated request', async () => {
    const res = await request(app).post(endpoint).send({ bookingId: 'someid' });
    expect(res.statusCode).toBe(401);
  });

  test('should reject when booking does not exist', async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ bookingId: new mongoose.Types.ObjectId().toString() });
    expect(res.statusCode).toBe(404);
  });

  test('should reject when user does not own the booking (role‑based)', async () => {
    const otherUser = await createTestUser({ email: 'other@example.com', role: 'user' });
    const otherToken = generateToken({ id: otherUser._id, role: otherUser.role });
    const booking = await Booking.create({
      user: otherUser._id,
      venue: venue._id,
      residentialArea: 'East',
      eventDate: '2025-11-20',
      startTime: '10:00',
      durationHours: 2,
      guestCount: 30,
      totalAmount: 800,
    });
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ bookingId: booking._id.toString() });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('should reject if booking is already paid/confirmed', async () => {
    const booking = await Booking.create({
      user: user._id,
      venue: venue._id,
      residentialArea: 'North',
      eventDate: '2025-10-05',
      startTime: '14:00',
      durationHours: 4,
      guestCount: 70,
      totalAmount: 2500,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
    });
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ bookingId: booking._id.toString() });
    expect(res.statusCode).toBe(400);
  });
});

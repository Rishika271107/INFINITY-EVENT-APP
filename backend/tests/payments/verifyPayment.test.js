// backend/tests/payments/verifyPayment.test.js
const request = require('supertest');
const app = require('../../server'); // Express app
const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const Transaction = require('../../models/Transaction');
const Venue = require('../../models/Venue');
const { createTestUser } = require('../utils/createTestUser');
const { generateToken } = require('../utils/generateToken');
const crypto = require('crypto');

// Mock Razorpay automatically via __mocks__/razorpay.js
jest.mock('razorpay');

/** Helper to wipe DB between tests */
async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
}

describe('POST /api/payment/verify - Razorpay signature verification', () => {
  let user, token, venue, booking;

  beforeAll(async () => {
    // connection already handled by globalSetup
  });

  beforeEach(async () => {
    await clearDatabase();
    user = await createTestUser({ email: 'verifier@example.com', role: 'user' });
    token = generateToken({ id: user._id, role: user.role });
    venue = await Venue.create({ name: 'Verify Venue', price: 1200, location: 'City', capacity: 150 });
    booking = await Booking.create({
      user: user._id,
      venue: venue._id,
      residentialArea: 'Downtown',
      eventDate: '2025-11-15',
      startTime: '19:00',
      durationHours: 2,
      guestCount: 30,
      totalAmount: 2400,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });
    // Simulate that an order was already created; attach order id
    booking.razorpay_order_id = 'order_test_123';
    await booking.save();
  });

  const endpoint = '/api/payment/verify';
  const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';

  function buildSignature(orderId, paymentId) {
    const payload = `${orderId}|${paymentId}`;
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  test('should verify a valid signature and mark payment as success', async () => {
    const razorpay_payment_id = 'pay_test_987';
    const razorpay_order_id = booking.razorpay_order_id;
    const razorpay_signature = buildSignature(razorpay_order_id, razorpay_payment_id);

    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId: booking._id.toString(),
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    // Booking and transaction records should be updated
    const updatedBooking = await Booking.findById(booking._id).lean();
    expect(updatedBooking.paymentStatus).toBe('paid');
    expect(updatedBooking.bookingStatus).toBe('confirmed');
    const txn = await Transaction.findOne({ razorpay_order_id }).lean();
    expect(txn).toBeTruthy();
    expect(txn.status).toBe('success');
    expect(txn.razorpay_payment_id).toBe(razorpay_payment_id);
  });

  test('should reject when signature verification fails', async () => {
    const razorpay_payment_id = 'pay_test_invalid';
    const razorpay_order_id = booking.razorpay_order_id;
    const razorpay_signature = 'tampered_signature';

    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    const updatedBooking = await Booking.findById(booking._id).lean();
    expect(updatedBooking.paymentStatus).not.toBe('paid');
  });

  test('should reject missing required parameters', async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ razorpay_order_id: 'order_test_123' }); // missing payment_id & signature
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject unauthenticated request', async () => {
    const res = await request(app).post(endpoint).send({});
    expect(res.statusCode).toBe(401);
  });

  test('should handle verification for a booking that does not exist', async () => {
    const fakeBookingId = new mongoose.Types.ObjectId().toString();
    const razorpay_order_id = 'order_nonexistent';
    const razorpay_payment_id = 'pay_123';
    const razorpay_signature = buildSignature(razorpay_order_id, razorpay_payment_id);
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId: fakeBookingId });
    expect(res.statusCode).toBe(404);
  });
});

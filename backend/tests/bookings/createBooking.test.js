// backend/tests/bookings/createBooking.test.js
const request = require('supertest');
const app = require('../../server'); // Express app
const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const Venue = require('../../models/Venue');
const { createTestUser } = require('../utils/createTestUser');
const { generateToken } = require('../utils/generateToken');

/** Helper to wipe DB between tests */
async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
}

describe('Booking Creation Endpoint', () => {
  let user, token;

  beforeAll(async () => {
    // ensure DB connection from globalSetup
  });

  beforeEach(async () => {
    await clearDatabase();
    // Create a regular user for auth tests
    user = await createTestUser({ email: 'user@example.com', role: 'user' });
    token = generateToken({ id: user._id, role: user.role });
  });

  const basePayload = {
    residentialArea: 'Downtown',
    eventDate: '2024-12-31',
    startTime: '18:00',
    durationHours: 4,
    guestCount: 50,
  };

  test('should create booking successfully (happy path)', async () => {
    // Arrange: create a venue that the booking will reference
    const venue = await Venue.create({
      name: 'Test Venue',
      price: 1500,
      location: 'Test City',
      capacity: 100,
    });
    const payload = { ...basePayload, venueId: venue._id.toString() };

    // Act
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    // Assert
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    const { bookingId, booking } = res.body.data;
    expect(bookingId).toBeTruthy();
    expect(booking).toMatchObject({
      venue: venue._id.toString(),
      residentialArea: payload.residentialArea,
      eventDate: payload.eventDate,
      startTime: payload.startTime,
      durationHours: Number(payload.durationHours),
      guestCount: Number(payload.guestCount),
    });
    // Ensure no internal fields leak (e.g., password, raw payment details)
    expect(booking).not.toHaveProperty('paymentStatus');
    // Verify persistence and ownership
    const persisted = await Booking.findById(bookingId).lean();
    expect(persisted).toBeTruthy();
    expect(persisted.user.toString()).toBe(user._id.toString());
  });

  test('should associate booking with authenticated user', async () => {
    const anotherUser = await createTestUser({ email: 'other@example.com', role: 'user' });
    const anotherToken = generateToken({ id: anotherUser._id, role: anotherUser.role });
    const venue = await Venue.create({
      name: 'Venue Two',
      price: 2000,
      location: 'City B',
      capacity: 150,
    });
    const payload = { ...basePayload, venueId: venue._id.toString() };

    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    const { bookingId } = res.body.data;
    const persisted = await Booking.findById(bookingId).lean();
    expect(persisted.user.toString()).toBe(anotherUser._id.toString());
  });

  // ---------- Validation Cases ----------
  test('should reject missing required fields', async () => {
    const payload = { ...basePayload }; // omit venueId and residentialArea etc.
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject invalid service/category IDs', async () => {
    const payload = { ...basePayload, venueId: 'invalid-id' };
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    // Mongoose casts invalid ObjectId to error -> 400 or 404
    expect([400, 404]).toContain(res.statusCode);
  });

  test('should reject invalid booking dates', async () => {
    const venue = await Venue.create({
      name: 'Venue X',
      price: 1200,
      location: 'Town',
      capacity: 80,
    });
    const payload = { ...basePayload, venueId: venue._id.toString(), eventDate: 'not-a-date' };
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.statusCode).toBe(400);
  });

  test('should reject malformed payloads', async () => {
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('{"venueId": "123", "residentialArea": "Area"'); // broken JSON
    expect(res.statusCode).toBe(400);
  });

  test('should reject empty payload', async () => {
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  // ---------- Security Cases ----------
  test('should reject unauthenticated booking creation', async () => {
    const venue = await Venue.create({
      name: 'Secure Venue',
      price: 1500,
      location: 'Secure City',
      capacity: 100,
    });
    const payload = { ...basePayload, venueId: venue._id.toString() };
    const res = await request(app).post('/api/bookings/create').send(payload);
    expect(res.statusCode).toBe(401);
  });

  test('should prevent duplicate booking creation when business rule disallows it', async () => {
    // Assuming duplicate is defined by same user + same venue + same eventDate
    const venue = await Venue.create({
      name: 'Dup Venue',
      price: 1800,
      location: 'Dup City',
      capacity: 120,
    });
    const payload = { ...basePayload, venueId: venue._id.toString() };
    // First creation
    await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    // Second attempt with identical details
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    // Business logic may return 409 Conflict or 400; accept either.
    expect([400, 409]).toContain(res.statusCode);
  });

  test('should reject tampered user ownership (token does not match payload user)', async () => {
    const anotherUser = await createTestUser({ email: 'hacker@example.com', role: 'user' });
    const anotherToken = generateToken({ id: anotherUser._id, role: anotherUser.role });
    const venue = await Venue.create({
      name: 'Secure Venue',
      price: 1600,
      location: 'Secure City',
      capacity: 100,
    });
    const payload = { ...basePayload, venueId: venue._id.toString() };
    // Attempt to create booking while forcing user ID in payload is not possible because controller uses req.user.
    // The test ensures that a token belonging to a different user cannot create a booking that would be linked to the original user.
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(payload);
    expect(res.statusCode).toBe(201);
    const { booking } = res.body.data;
    expect(booking.user).toBe(otherUser._id.toString()); // implicitly verified in happy path above
  });

  // ---------- Edge Cases ----------
  test('should reject invalid MongoDB ObjectId format for venueId', async () => {
    const payload = { ...basePayload, venueId: '12345' };
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect([400, 404]).toContain(res.statusCode);
  });

  test('should handle extremely large payload without breaking', async () => {
    const venue = await Venue.create({
      name: 'Big Payload Venue',
      price: 2000,
      location: 'Big City',
      capacity: 5000,
    });
    const largeString = 'A'.repeat(5000);
    const payload = {
      ...basePayload,
      venueId: venue._id.toString(),
      residentialArea: largeString,
    };
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    // Should either succeed (if allowed) or be rejected cleanly.
    expect([201, 400]).toContain(res.statusCode);
  });

  test('should reject unexpected service category', async () => {
    const venue = await Venue.create({
      name: 'Service Test Venue',
      price: 1300,
      location: 'Service City',
      capacity: 90,
    });
    const payload = {
      ...basePayload,
      venueId: venue._id.toString(),
      serviceType: 'unknownService',
    };
    const res = await request(app)
      .post('/api/bookings/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    // Controller treats missing required fields for service booking; expect failure.
    expect(res.statusCode).toBe(400);
  });
});

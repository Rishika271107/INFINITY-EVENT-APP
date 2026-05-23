// backend/tests/auth/protectedRoutes.test.js
const request = require('supertest');
const app = require('../../server'); // Express app
const mongoose = require('mongoose');
const { createTestUser } = require('../utils/createTestUser');
const { generateToken } = require('../utils/generateToken');

/** Helper to wipe DB between tests */
async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
}

describe('Protected Routes Authorization', () => {
  let user, admin;

  beforeAll(async () => {
    // Ensure DB connection exists (globalSetup does this)
  });

  beforeEach(async () => {
    await clearDatabase();
    // Create a normal user and an admin user
    user = await createTestUser({ email: 'user@example.com', role: 'user' });
    admin = await createTestUser({ email: 'admin@example.com', role: 'admin' });
  });

  const userRoute = '/api/bookings'; // protected user route
  const adminRoute = '/api/admin/stats'; // admin‑only route

  test('valid JWT allows access to protected user route', async () => {
    const token = generateToken({ id: user._id, role: user.role });
    const res = await request(app)
      .get(userRoute)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('valid admin JWT allows access to admin route', async () => {
    const token = generateToken({ id: admin._id, role: admin.role });
    const res = await request(app)
      .get(adminRoute)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('missing token returns 401', async () => {
    const res = await request(app).get(userRoute);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('malformed token returns 401', async () => {
    const res = await request(app)
      .get(userRoute)
      .set('Authorization', 'Bearer malformed.token.here');
    expect(res.statusCode).toBe(401);
  });

  test('expired token returns 401', async () => {
    // Token that is already expired
    const expiredToken = generateToken({ id: user._id, role: user.role }, '-1s');
    const res = await request(app)
      .get(userRoute)
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
  });

  test('invalid signature token returns 401', async () => {
    const valid = generateToken({ id: user._id, role: user.role });
    // Flip the last character to corrupt signature
    const tampered = valid.slice(0, -1) + (valid.slice(-1) === 'a' ? 'b' : 'a');
    const res = await request(app)
      .get(userRoute)
      .set('Authorization', `Bearer ${tampered}`);
    expect(res.statusCode).toBe(401);
  });

  test('normal user denied access to admin route (403)', async () => {
    const token = generateToken({ id: user._id, role: user.role });
    const res = await request(app)
      .get(adminRoute)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message');
  });
});

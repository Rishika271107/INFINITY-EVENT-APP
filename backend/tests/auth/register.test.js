const request = require('supertest');
const app = require('../../server'); // Express app
const mongoose = require('mongoose');
const { createTestUser } = require('../utils/createTestUser');

/** Utility to clear all collections between tests */
async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
}

describe('Auth Register Endpoint', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  const registerUrl = '/api/auth/register';

  test('should register a new user successfully', async () => {
    const payload = {
      username: 'TestUser',
      email: 'testuser@example.com',
      phone: '1234567890',
      password: 'StrongPass!23'
    };

    const res = await request(app).post(registerUrl).send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
    // Ensure password is not returned
    expect(res.body).not.toHaveProperty('password');
    // Verify user exists in DB and password is hashed
    const User = require('../../models/User');
    const userInDb = await User.findOne({ email: payload.email.toLowerCase() });
    expect(userInDb).not.toBeNull();
    expect(userInDb.password).not.toBe(payload.password);
    // Password should be a bcrypt hash (starts with $2a$ or $2b$)
    expect(userInDb.password).toMatch(/^\$2[aby]\$/);
  });

  test('should reject duplicate email registration', async () => {
    // create a user first
    await createTestUser({ email: 'dup@example.com' });
    const payload = {
      username: 'Another',
      email: 'dup@example.com',
      phone: '1112223333',
      password: 'AnotherPass!23'
    };
    const res = await request(app).post(registerUrl).send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject invalid email format', async () => {
    const payload = {
      username: 'BadEmail',
      email: 'not-an-email',
      phone: '1234567890',
      password: 'StrongPass!23'
    };
    const res = await request(app).post(registerUrl).send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject weak password', async () => {
    const payload = {
      username: 'WeakPass',
      email: 'weak@example.com',
      phone: '1234567890',
      password: '12345'
    };
    const res = await request(app).post(registerUrl).send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject missing required fields', async () => {
    const payload = {
      email: 'missing@example.com',
      password: 'StrongPass!23'
      // username and phone omitted
    };
    const res = await request(app).post(registerUrl).send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject empty payload', async () => {
    const res = await request(app).post(registerUrl).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should never expose password hash in response', async () => {
    const payload = {
      username: 'SecureUser',
      email: 'secure@example.com',
      phone: '1234567890',
      password: 'StrongPass!23'
    };
    const res = await request(app).post(registerUrl).send(payload);
    expect(res.body).not.toHaveProperty('password');
  });

  test('should handle malformed JSON gracefully', async () => {
    const res = await request(app)
      .post(registerUrl)
      .set('Content-Type', 'application/json')
      .send('{"username": "BadJSON", "email": "bad@example.com"'); // missing closing brace
    // Express returns 400 Bad Request for parser errors
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

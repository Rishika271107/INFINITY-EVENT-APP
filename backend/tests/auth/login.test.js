const request = require('supertest');
const app = require('../../server'); // Express app
const mongoose = require('mongoose');
const { createTestUser } = require('../utils/createTestUser');
const { generateToken } = require('../utils/generateToken');

/** Utility to clear all collections between tests */
async function clearDatabase() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
}

describe('Auth Login Endpoint', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  const loginUrl = '/api/auth/login';

  test('should login successfully with valid credentials', async () => {
    const password = 'StrongPass!23';
    const user = await createTestUser({ email: 'login@example.com', password, role: 'user' });
    const payload = { email: 'login@example.com', password };
    const res = await request(app).post(loginUrl).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    // Ensure password not in response
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('should reject login with invalid password', async () => {
    const password = 'StrongPass!23';
    await createTestUser({ email: 'badpass@example.com', password });
    const payload = { email: 'badpass@example.com', password: 'WrongPass' };
    const res = await request(app).post(loginUrl).send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject login for non-existent user', async () => {
    const res = await request(app).post(loginUrl).send({ email: 'nosuch@example.com', password: 'AnyPass' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject login with invalid email format', async () => {
    const res = await request(app).post(loginUrl).send({ email: 'not-an-email', password: 'Pass123!' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should reject login with empty credentials', async () => {
    const res = await request(app).post(loginUrl).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('should handle malformed JSON gracefully', async () => {
    const res = await request(app)
      .post(loginUrl)
      .set('Content-Type', 'application/json')
      .send('{"email": "badjson@example.com", "password": "Pass'); // malformed
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

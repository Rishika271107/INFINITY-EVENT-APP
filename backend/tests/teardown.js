// tests/teardown.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  // Ensure all connections are closed
  await mongoose.disconnect();
  // Stop the in‑memory server if it was started
  if (global.__MONGOINSTANCE__) {
    await global.__MONGOINSTANCE__.stop();
  }
};

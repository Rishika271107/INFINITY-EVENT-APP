const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedUsers() {
  console.log('🌱 Starting Auto-Seed Process...');
  try {
    const adminEmail = 'admin@infinity.com';
    const userEmail = 'user@infinity.com';

    const adminPassword = await bcrypt.hash('Admin@123!', 10);
    await User.findOneAndUpdate(
      { email: adminEmail },
      { 
        $setOnInsert: { 
          password: adminPassword,
          role: 'admin',
          username: 'Admin'
        },
        $set: {
          phone: '0000000000',
          isVerified: true,
          isBlocked: false,
          failedLoginAttempts: 0,
          lockUntil: null
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✅ Admin account seeded/verified');

    // Seed User
    const userPassword = await bcrypt.hash('User@123!', 10);
    await User.findOneAndUpdate(
      { email: userEmail },
      { 
        $setOnInsert: { 
          password: userPassword,
          role: 'user',
          username: 'Test User'
        },
        $set: {
          phone: '1111111111',
          isVerified: true,
          isBlocked: false,
          failedLoginAttempts: 0,
          lockUntil: null
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✅ User account seeded/verified');
    
    console.log('✅ Auto-Seed Process Complete');
  } catch (error) {
    console.error('❌ Auto-Seed Process Failed:', error);
    // Don't crash the server, just log the error. Or maybe crash if it's required?
    // "If DB fails -> server must not start". Seed failure should probably crash it to be safe, but let's just throw it.
    throw error;
  }
}

module.exports = seedUsers;

// Allow running from CLI directly (npm run seed)
if (require.main === module) {
  require('dotenv').config();
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true
  }).then(async () => {
    await seedUsers();
    mongoose.disconnect();
  }).catch(err => {
    console.error('MongoDB connection error during seed:', err);
    process.exit(1);
  });
}

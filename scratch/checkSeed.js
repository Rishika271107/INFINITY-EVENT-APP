// scratch/checkSeed.js – check admin and user seed existence
require('dotenv').config({ path: __dirname + '/../backend/.env' });
const mongoose = require('mongoose');
const User = require('../backend/models/User');
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');
    const admin = await User.findOne({ email: 'admin@infinity.com' }).lean();
    const user = await User.findOne({ email: 'user@infinity.com' }).lean();
    console.log('Admin exists:', !!admin);
    console.log('User exists:', !!user);
    console.log('Admin doc:', admin);
    console.log('User doc:', user);
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (err) {
    console.error('❌ Error', err);
    process.exit(1);
  }
})();

// Run with: npm run seed
// Creates (or updates the password of) one demo admin account so judges
// can log in immediately without signing up manually.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const DEMO_ADMIN = {
  name: 'Admin',
  email: 'admin@campus.edu',
  password: 'admin123',
  role: 'admin',
};

(async () => {
  await connectDB();
  const passwordHash = await bcrypt.hash(DEMO_ADMIN.password, 10);

  await User.findOneAndUpdate(
    { email: DEMO_ADMIN.email },
    { name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, passwordHash, role: 'admin' },
    { upsert: true, new: true }
  );

  console.log(`Seeded demo admin: ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  await mongoose.disconnect();
  process.exit(0);
})();

// createManager.js (run manually once)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Manager = require('./models/Manager');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash('admin123', 10);
  await Manager.create({ email: 'admin@example.com', password: hashed });
  console.log('Manager created');
  process.exit();
});

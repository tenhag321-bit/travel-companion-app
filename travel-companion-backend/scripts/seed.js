// scripts/seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Recommendation from '../models/Recommendation.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to DB');

    // ... same logic as in /api/seed/all ...

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '--run') {
  seed();
} else {
  console.log('ℹ️  Run with: npm run seed');
}
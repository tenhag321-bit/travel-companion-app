// routes/seed.js
import express from 'express';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Recommendation from '../models/Recommendation.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Sample data (synced with your frontend mock!)
const seedDestinations = [
  {
    name: 'Paris',
    country: 'France',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River'],
    description: 'The City of Light offers art, culture, and culinary delights.',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
    highlights: ['Fushimi Inari', 'Kinkaku-ji', 'Arashiyama Bamboo Grove'],
    description: 'Ancient temples, traditional gardens, and geisha districts.',
    coordinates: { lat: 35.0116, lng: 135.7681 }
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1514939473753-d1e348378657?w=600&h=400&fit=crop',
    highlights: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter'],
    description: 'Gaudi architecture, Mediterranean beaches, and vibrant culture.',
    coordinates: { lat: 41.3851, lng: 2.1734 }
  },
  {
    name: 'Santorini',
    country: 'Greece',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&h=400&fit=crop',
    highlights: ['Oia Sunset', 'Red Beach', 'Ancient Thera'],
    description: 'Stunning sunsets, white-washed buildings, and crystal waters.',
    coordinates: { lat: 36.3932, lng: 25.4615 }
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabee2b?w=600&h=400&fit=crop',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market'],
    description: 'Futuristic technology meets ancient traditions.',
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    name: 'Rome',
    country: 'Italy',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
    description: 'Ancient ruins, Renaissance art, and world-class cuisine.',
    coordinates: { lat: 41.9028, lng: 12.4964 }
  }
];

// Test users
const seedUsers = [
  { name: 'Alex Morgan', email: 'hello@alexmorgan.dev', password: 'password123' },
  { name: 'Test User', email: 'test@example.com', password: 'password123' }
];

// Sample recommendations (Paris-based)
const seedRecommendations = async () => {
  const users = await User.find();
  if (users.length === 0) return [];

  const paris = await Destination.findOne({ name: 'Paris' });
  const coords = paris?.coordinates || { lat: 48.8566, lng: 2.3522 };

  return [
    {
      user: users[0]._id,
      name: 'Du Pain et des Idées',
      type: 'food',
      rating: 4.9,
      description: 'World-famous croissants and pastries',
      image: 'https://images.unsplash.com/photo-1570197788417-0e8278344a34?w=300&h=200&fit=crop',
      coordinates: { lat: 48.8768, lng: 2.3645 }
    },
    {
      user: users[0]._id,
      name: 'Musée de la Chasse et de la Nature',
      type: 'sightseeing',
      rating: 4.6,
      description: 'Unique museum of hunting and nature',
      image: 'https://images.unsplash.com/photo-1535223268316-9a8a0b0f6a3c?w=300&h=200&fit=crop',
      coordinates: { lat: 48.8605, lng: 2.3602 }
    },
    {
      user: users[1]._id,
      name: 'Marché des Enfants Rouges',
      type: 'food',
      rating: 4.7,
      description: 'Oldest covered market in Paris',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      coordinates: { lat: 48.8623, lng: 2.3625 }
    }
  ];
};

// 🚀 Seed all
router.post('/all', async (req, res) => {
  try {
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Recommendation.deleteMany({});
    
    // Seed users
    const users = await Promise.all(
      seedUsers.map(async user => {
        const hashed = await bcrypt.hash(user.password, 12);
        return new User({ ...user, password: hashed }).save();
      })
    );

    // Seed destinations
    const destinations = await Destination.insertMany(seedDestinations);

    // Seed recommendations
    const recsData = await seedRecommendations();
    const recommendations = await Recommendation.insertMany(recsData);

    res.status(201).json({
      message: '✅ Database seeded successfully!',
      counts: {
        users: users.length,
        destinations: destinations.length,
        recommendations: recommendations.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

// 🌍 Seed only destinations
router.post('/destinations', async (req, res) => {
  try {
    await Destination.deleteMany({});
    const inserted = await Destination.insertMany(seedDestinations);
    res.status(201).json({ message: '✅ Destinations seeded', count: inserted.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👤 Seed only users (for quick auth testing)
router.post('/users', async (req, res) => {
  try {
    await User.deleteMany({});
    const users = await Promise.all(
      seedUsers.map(async user => {
        const hashed = await bcrypt.hash(user.password, 12);
        return new User({ ...user, password: hashed }).save();
      })
    );
    res.status(201).json({ message: '✅ Users seeded', count: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
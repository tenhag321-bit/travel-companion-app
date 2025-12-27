// routes/recommendations.js
import express from 'express';
import Recommendation from '../models/Recommendation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's recommendations (with optional location filter)
// @route   GET /api/recommendations
router.get('/', protect, async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in km

    let query = { user: req.user.id };

    // Optional: filter by proximity if coords provided
    if (lat && lng) {
      // Use haversine approximation or $geoWithin/$near if you add 2dsphere index
      // For now, client-side filtering is fine; alternatively:
      // → Add `location: { type: Point, coordinates: [lng, lat] }` + 2dsphere index
    }

    const recommendations = await Recommendation.find(query).sort({ createdAt: -1 });
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create recommendation
// @route   POST /api/recommendations
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, rating = 5, description, image, coordinates } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const recommendation = new Recommendation({
      user: req.user.id,
      name,
      type,
      rating,
      description,
      image,
      coordinates
    });

    const saved = await recommendation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Invalid data' });
  }
});

// @desc    Delete recommendation
// @route   DELETE /api/recommendations/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const rec = await Recommendation.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!rec) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    await rec.deleteOne();
    res.json({ message: 'Recommendation deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
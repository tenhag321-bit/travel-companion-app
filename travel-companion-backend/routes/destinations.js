// routes/destinations.js
import express from 'express';
import Destination from '../models/Destination.js';

const router = express.Router();

// @desc    Get all destinations
// @route   GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const { search, limit = 20, page = 1 } = req.query;
    const query = {};
    
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { country: regex },
        { highlights: regex }
      ];
    }

    const skip = (page - 1) * limit;
    const destinations = await Destination.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
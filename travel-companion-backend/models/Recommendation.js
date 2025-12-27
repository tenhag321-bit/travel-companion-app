// models/Recommendation.js
import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['food', 'sightseeing', 'shopping', 'entertainment', 'accommodation'],
    default: 'food'
  },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  coordinates: {
    lat: Number,
    lng: Number
  },
  // Optional: auto-populate distance client-side
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model('Recommendation', recommendationSchema);
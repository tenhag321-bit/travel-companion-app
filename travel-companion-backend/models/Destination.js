// models/Destination.js
import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 4.5 },
  image: { type: String, default: '' },
  highlights: [{ type: String }],
  description: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Optional: ensure uniqueness for seeding
destinationSchema.index({ name: 1, country: 1 }, { unique: true });

export default mongoose.model('Destination', destinationSchema);
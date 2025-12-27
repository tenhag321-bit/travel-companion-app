// models/ItineraryItem.js
import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: String,
  activity: { type: String, required: true },
  location: String,
  duration: String,
  category: { 
    type: String, 
    enum: ['sightseeing', 'food', 'activity', 'shopping', 'entertainment', 'transportation'],
    default: 'sightseeing'
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ItineraryItem', itinerarySchema);
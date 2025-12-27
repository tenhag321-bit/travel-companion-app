// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// 🔒 Safety check: critical env vars
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set in .env');
  process.exit(1);
}

// ✅ 1. Initialize Express app
const app = express();

// ✅ 2. Global middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // support JSON payloads

// ✅ 3. Import routes (MUST come AFTER `app` is declared)
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import itineraryRoutes from './routes/itinerary.js';

// ✅ 4. Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/itinerary', itineraryRoutes);

// ✅ 5. Root route (health check)
app.get('/', (req, res) => {
  res.json({
    message: '✅ Travel Companion Backend Running',
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/api/auth',
      destinations: '/api/destinations',
      itinerary: '/api/itinerary'
    }
  });
});

// ✅ 6. 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ 7. Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ 8. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📚 API docs: visit http://localhost:${PORT}`);
});
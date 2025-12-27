// routes/itinerary.js
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Itinerary route working!' });
});

export default router;

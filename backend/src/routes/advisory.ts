import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getWeather, getPestAlerts, getInsights } from '../controllers/advisoryController';

const router = express.Router();

router.get('/weather', authMiddleware, getWeather);
router.get('/pest', authMiddleware, getPestAlerts);
router.get('/insights', authMiddleware, getInsights);

export default router;

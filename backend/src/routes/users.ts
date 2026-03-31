import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getProfile, updateProfile, getOverview } from '../controllers/userController';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/overview', authMiddleware, getOverview);

export default router;

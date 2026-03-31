import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getPrices, getListings, createListing, updateListing, deleteListing, getOverview } from '../controllers/marketController';

const router = express.Router();

router.get('/prices', authMiddleware, getPrices);
router.get('/listings', authMiddleware, getListings);
router.post('/listings', authMiddleware, createListing);
router.put('/listings/:id', authMiddleware, updateListing);
router.delete('/listings/:id', authMiddleware, deleteListing);
router.get('/overview', authMiddleware, getOverview);

export default router;

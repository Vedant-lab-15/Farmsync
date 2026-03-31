import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getShipments, getShipmentHistory, getShipmentOverview, getShipmentById, createShipment } from '../controllers/shipmentController';

const router = express.Router();

router.get('/', authMiddleware, getShipments);
router.post('/', authMiddleware, createShipment);
router.get('/history', authMiddleware, getShipmentHistory);
router.get('/overview', authMiddleware, getShipmentOverview);
router.get('/:id', authMiddleware, getShipmentById);

export default router;

import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getAllRecords, getRecordById, createRecord } from '../controllers/traceabilityController';

const router = express.Router();

router.get('/', authMiddleware, getAllRecords);
router.post('/', authMiddleware, createRecord);
router.get('/:productId', authMiddleware, getRecordById);

export default router;

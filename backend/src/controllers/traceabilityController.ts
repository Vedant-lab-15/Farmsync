import { Request, Response } from 'express';
import { TraceabilityRecord } from '../models/TraceabilityRecord';

const buildSeedRecord = (productId: string, farmerId: string) => ({
  productId,
  farmerId,
  crop: 'Alphonso Mango',
  batch: 'Batch A',
  farm: 'Green Valley Farm, Nashik',
  harvestDate: new Date('2025-09-15'),
  quality: 'Grade A',
  certifications: ['Organic', 'Fair Trade', 'GAP Certified'],
  supplyChain: [
    { stage: 'Farm', location: 'Nashik, Maharashtra', date: new Date('2025-09-15'), status: 'Harvested', details: 'Fresh harvest from organic farm' },
    { stage: 'Collection Center', location: 'Nashik Collection Point', date: new Date('2025-09-16'), status: 'Quality Checked', details: 'Quality inspection passed' },
    { stage: 'Transport', location: 'Nashik to Mumbai', date: new Date('2025-09-17'), status: 'In Transit', details: 'Temperature controlled transport' },
    { stage: 'Market', location: 'Mumbai Wholesale Market', date: new Date('2025-09-18'), status: 'Delivered', details: 'Delivered to buyer' },
  ],
  tests: [
    { type: 'Pesticide Residue', result: 'Negative', date: new Date('2025-09-16') },
    { type: 'Moisture Content', result: '12%', date: new Date('2025-09-16') },
    { type: 'Quality Grade', result: 'A+', date: new Date('2025-09-16') },
  ],
  status: 'Active' as const,
});

export const getAllRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await TraceabilityRecord.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Get traceability records error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    let record = await TraceabilityRecord.findOne({ productId });

    // Auto-create a seed record if not found (demo mode)
    if (!record) {
      record = await TraceabilityRecord.create(buildSeedRecord(productId, req.user._id.toString()));
    }

    res.json({ success: true, data: record });
  } catch (error) {
    console.error('Get traceability record error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await TraceabilityRecord.findOne({ productId: req.body.productId });
    if (existing) {
      res.status(400).json({ success: false, message: 'Product ID already exists' });
      return;
    }
    const record = await TraceabilityRecord.create({ ...req.body, farmerId: req.user._id });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    console.error('Create traceability record error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

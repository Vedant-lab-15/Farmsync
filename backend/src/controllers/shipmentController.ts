import { Request, Response } from 'express';
import { Shipment } from '../models/Shipment';

// Seed data used when DB has no records for this user
const SEED_SHIPMENTS = [
  { from: 'Nashik', to: 'Mumbai', status: 'in-transit' as const, progress: 65, crop: 'Tomato', quantity: 500, unit: 'kg', estimatedDelivery: new Date('2025-10-02') },
  { from: 'Pune', to: 'Nagpur', status: 'processing' as const, progress: 20, crop: 'Rice', quantity: 1000, unit: 'quintal', estimatedDelivery: new Date('2025-10-05') },
  { from: 'Solapur', to: 'Pune', status: 'in-transit' as const, progress: 45, crop: 'Wheat', quantity: 800, unit: 'quintal', estimatedDelivery: new Date('2025-10-03') },
];

const SEED_HISTORY = [
  { from: 'Nashik', to: 'Mumbai', status: 'delivered' as const, progress: 100, crop: 'Tomato', quantity: 400, unit: 'kg', estimatedDelivery: new Date('2025-09-25'), actualDelivery: new Date('2025-09-25'), deliveryTime: '2 days', rating: 4.8, feedback: 'Excellent quality produce, on-time delivery' },
  { from: 'Pune', to: 'Nagpur', status: 'delivered' as const, progress: 100, crop: 'Rice', quantity: 800, unit: 'quintal', estimatedDelivery: new Date('2025-09-20'), actualDelivery: new Date('2025-09-21'), deliveryTime: '3 days', rating: 4.5, feedback: 'Good quality, slight delay but acceptable' },
  { from: 'Aurangabad', to: 'Mumbai', status: 'delivered' as const, progress: 100, crop: 'Onion', quantity: 250, unit: 'kg', estimatedDelivery: new Date('2025-09-18'), actualDelivery: new Date('2025-09-18'), deliveryTime: '1 day', rating: 5.0, feedback: 'Perfect delivery, excellent packaging' },
];

export const getShipments = async (req: Request, res: Response): Promise<void> => {
  try {
    let shipments = await Shipment.find({
      farmerId: req.user._id,
      status: { $ne: 'delivered' },
    }).sort({ createdAt: -1 });

    // Return seed data if no DB records yet
    if (shipments.length === 0) {
      res.json({ success: true, data: SEED_SHIPMENTS.map((s, i) => ({ id: String(i + 1), ...s })) });
      return;
    }

    res.json({ success: true, data: shipments });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getShipmentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    let history = await Shipment.find({
      farmerId: req.user._id,
      status: 'delivered',
    }).sort({ actualDelivery: -1 });

    if (history.length === 0) {
      res.json({ success: true, data: SEED_HISTORY.map((s, i) => ({ id: String(i + 6), ...s })) });
      return;
    }

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Get shipment history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getShipmentOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const [active, delivered] = await Promise.all([
      Shipment.countDocuments({ farmerId: req.user._id, status: { $ne: 'delivered' } }),
      Shipment.countDocuments({ farmerId: req.user._id, status: 'delivered' }),
    ]);

    const ratingAgg = await Shipment.aggregate([
      { $match: { farmerId: req.user._id, status: 'delivered', rating: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalShipments: active + delivered,
        activeShipments: active,
        completedShipments: delivered,
        onTimeDelivery: 85,
        averageRating: ratingAgg[0]?.avg ? Math.round(ratingAgg[0].avg * 10) / 10 : 4.6,
      },
    });
  } catch (error) {
    console.error('Get shipment overview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getShipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shipment = await Shipment.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!shipment) {
      res.status(404).json({ success: false, message: 'Shipment not found' });
      return;
    }
    res.json({ success: true, data: shipment });
  } catch (error) {
    console.error('Get shipment by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createShipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to, crop, quantity, unit, estimatedDelivery } = req.body;
    const shipment = await Shipment.create({
      farmerId: req.user._id,
      from, to, crop, quantity, unit,
      estimatedDelivery: new Date(estimatedDelivery),
      status: 'processing',
      progress: 0,
    });
    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

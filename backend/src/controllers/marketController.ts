import { Request, Response } from 'express';
import { MarketListing } from '../models/MarketListing';

// Static price data (would come from a market data API in production)
const MARKET_PRICES = [
  { id: '1', crop: 'Alphonso Mango', price: 150, unit: 'kg', market: 'Ratnagiri Fruit Market', trend: 'up', change: 7.14 },
  { id: '2', crop: 'Kesar Mango', price: 130, unit: 'kg', market: 'Junagadh Market', trend: 'down', change: -3.7 },
  { id: '3', crop: 'Dasheri Mango', price: 120, unit: 'kg', market: 'Lucknow Market', trend: 'neutral', change: 0 },
  { id: '4', crop: 'Langra Mango', price: 110, unit: 'kg', market: 'Varanasi Market', trend: 'up', change: 4.76 },
  { id: '5', crop: 'Himsagar Mango', price: 140, unit: 'kg', market: 'West Bengal Market', trend: 'down', change: -3.45 },
  { id: '6', crop: 'Tomato', price: 45, unit: 'kg', market: 'Nashik Market', trend: 'up', change: 10.5 },
  { id: '7', crop: 'Onion', price: 30, unit: 'kg', market: 'Lasalgaon Market', trend: 'down', change: -5.0 },
  { id: '8', crop: 'Rice (Basmati)', price: 85, unit: 'kg', market: 'Delhi Grain Market', trend: 'up', change: 2.4 },
  { id: '9', crop: 'Wheat', price: 28, unit: 'kg', market: 'Punjab Mandi', trend: 'neutral', change: 0.5 },
  { id: '10', crop: 'Sugarcane', price: 3.5, unit: 'kg', market: 'Kolhapur Market', trend: 'up', change: 1.2 },
];

export const getPrices = (_req: Request, res: Response): void => {
  res.json({ success: true, data: MARKET_PRICES });
};

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await MarketListing.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: listings });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, variety, quantity, unit, price, quality, location, harvestDate, certifications, description } = req.body;
    const listing = await MarketListing.create({
      farmerId: req.user._id,
      crop, variety, quantity, unit, price, quality, location,
      harvestDate: new Date(harvestDate),
      certifications: certifications || [],
      description,
      status: 'active',
    });
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await MarketListing.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }
    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await MarketListing.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }
    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const [total, active, sold] = await Promise.all([
      MarketListing.countDocuments({ farmerId: req.user._id }),
      MarketListing.countDocuments({ farmerId: req.user._id, status: 'active' }),
      MarketListing.countDocuments({ farmerId: req.user._id, status: 'sold' }),
    ]);

    res.json({
      success: true,
      data: {
        totalListings: total,
        activeListings: active,
        soldListings: sold,
        totalRevenue: 45231,
        monthlyRevenue: 12500,
        topPerformingCrop: 'Alphonso Mango',
        marketTrends: MARKET_PRICES.filter((p) => p.trend === 'up').slice(0, 3),
      },
    });
  } catch (error) {
    console.error('Get market overview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

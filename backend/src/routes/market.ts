import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/market/prices
// @desc    Get market prices
// @access  Private
router.get('/prices', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data with proper structure
    const prices = [
      {
        id: '1',
        crop: 'Mango',
        price: 120,
        unit: 'kg',
        market: 'Fruit Market',
        trend: 'up',
        change: 10.5
      }
    ];

    res.json({
      success: true,
      data: prices
    });
  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/market/listings
// @desc    Get marketplace listings
// @access  Private
router.get('/listings', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for marketplace listings
    const listings = [
      {
        id: '1',
        farmerId: 'user123',
        crop: 'Mango',
        variety: 'Alphonso',
        quantity: 300,
        unit: 'kg',
        price: 120,
        quality: 'Grade A',
        location: 'Ratnagiri, Maharashtra',
        harvestDate: '2024-05-15',
        certifications: ['Organic', 'Fair Trade'],
        description: 'Premium Alphonso mangoes, sweet and juicy',
        images: ['https://example.com/mango1.jpg'],
        status: 'active',
        createdAt: '2024-05-10T10:00:00Z'
      }
    ];

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Get marketplace listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/market/overview
// @desc    Get market overview data
// @access  Private
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for market overview
    const overview = {
      totalListings: 1,
      activeListings: 1,
      soldListings: 0,
      totalRevenue: 36000,
      monthlyRevenue: 12000,
      topPerformingCrop: 'Mango',
      marketTrends: [
        {
          crop: 'Mango',
          trend: 'up',
          change: 10.5,
          volume: 300
        }
      ],
      buyerInterest: [
        {
          crop: 'Organic Mango',
          inquiries: 20,
          interestedBuyers: 10
        }
      ]
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Get market overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

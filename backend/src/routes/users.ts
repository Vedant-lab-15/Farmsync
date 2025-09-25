import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/overview
// @desc    Get user overview data
// @access  Private
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for user overview
    const overview = {
      profile: {
        name: 'Rajesh Kumar',
        role: 'farmer',
        location: 'Nashik, Maharashtra',
        experience: '8 years',
        rating: 4.8,
        totalReviews: 156,
        joinDate: '2020-03-15'
      },
      stats: {
        totalListings: 12,
        activeListings: 8,
        soldProducts: 4,
        totalRevenue: 45231,
        monthlyRevenue: 12500,
        averageRating: 4.6,
        totalShipments: 15,
        completedShipments: 10
      },
      recentActivity: [
        {
          id: '1',
          type: 'listing',
          title: 'New Tomato Listing Created',
          description: 'Cherry Tomato - 500kg at ₹45/kg',
          timestamp: '2024-09-20T10:00:00Z',
          status: 'success'
        },
        {
          id: '2',
          type: 'shipment',
          title: 'Shipment Delivered',
          description: 'Rice shipment to Mumbai completed',
          timestamp: '2024-09-19T14:30:00Z',
          status: 'success'
        },
        {
          id: '3',
          type: 'payment',
          title: 'Payment Received',
          description: '₹2,800 received for Onion sale',
          timestamp: '2024-09-18T16:45:00Z',
          status: 'success'
        },
        {
          id: '4',
          type: 'alert',
          title: 'Weather Alert',
          description: 'Heavy rain expected tomorrow',
          timestamp: '2024-09-18T09:15:00Z',
          status: 'warning'
        }
      ],
      achievements: [
        {
          id: '1',
          title: 'First Sale',
          description: 'Completed your first successful sale',
          icon: '🏆',
          unlockedAt: '2020-04-01'
        },
        {
          id: '2',
          title: 'Quality Farmer',
          description: 'Maintained 4.5+ star rating for 6 months',
          icon: '⭐',
          unlockedAt: '2021-01-15'
        },
        {
          id: '3',
          title: 'Volume Seller',
          description: 'Sold over 10 tons of produce',
          icon: '🚛',
          unlockedAt: '2022-08-20'
        }
      ]
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Get user overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/shipments
// @desc    Get user shipments
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data with proper structure
    const shipments = [
      {
        id: '1',
        from: 'Nashik',
        to: 'Mumbai',
        status: 'in-transit',
        progress: 65,
        estimatedDelivery: '2025-10-02',
        crop: 'Tomato',
        quantity: 500,
        unit: 'kg'
      },
      {
        id: '2',
        from: 'Pune',
        to: 'Nagpur',
        status: 'processing',
        progress: 20,
        estimatedDelivery: '2025-10-05',
        crop: 'Rice',
        quantity: 1000,
        unit: 'quintal'
      },
      {
        id: '3',
        from: 'Aurangabad',
        to: 'Mumbai',
        status: 'delivered',
        progress: 100,
        estimatedDelivery: '2025-09-28',
        crop: 'Onion',
        quantity: 300,
        unit: 'kg'
      },
      {
        id: '4',
        from: 'Solapur',
        to: 'Pune',
        status: 'in-transit',
        progress: 45,
        estimatedDelivery: '2025-10-03',
        crop: 'Wheat',
        quantity: 800,
        unit: 'quintal'
      },
      {
        id: '5',
        from: 'Kolhapur',
        to: 'Mumbai',
        status: 'processing',
        progress: 10,
        estimatedDelivery: '2025-10-07',
        crop: 'Sugarcane',
        quantity: 2000,
        unit: 'quintal'
      }
    ];

    res.json({
      success: true,
      data: shipments
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/shipments/history
// @desc    Get shipment history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for shipment history
    const shipmentHistory = [
      {
        id: '6',
        from: 'Nashik',
        to: 'Mumbai',
        status: 'delivered',
        progress: 100,
        estimatedDelivery: '2024-09-25',
        actualDelivery: '2024-09-25',
        crop: 'Tomato',
        quantity: 400,
        unit: 'kg',
        deliveryTime: '2 days',
        rating: 4.8,
        feedback: 'Excellent quality produce, on-time delivery'
      },
      {
        id: '7',
        from: 'Pune',
        to: 'Nagpur',
        status: 'delivered',
        progress: 100,
        estimatedDelivery: '2024-09-20',
        actualDelivery: '2024-09-21',
        crop: 'Rice',
        quantity: 800,
        unit: 'quintal',
        deliveryTime: '3 days',
        rating: 4.5,
        feedback: 'Good quality, slight delay but acceptable'
      },
      {
        id: '8',
        from: 'Aurangabad',
        to: 'Mumbai',
        status: 'delivered',
        progress: 100,
        estimatedDelivery: '2024-09-18',
        actualDelivery: '2024-09-18',
        crop: 'Onion',
        quantity: 250,
        unit: 'kg',
        deliveryTime: '1 day',
        rating: 5.0,
        feedback: 'Perfect delivery, excellent packaging'
      },
      {
        id: '9',
        from: 'Solapur',
        to: 'Pune',
        status: 'delivered',
        progress: 100,
        estimatedDelivery: '2024-09-15',
        actualDelivery: '2024-09-16',
        crop: 'Wheat',
        quantity: 600,
        unit: 'quintal',
        deliveryTime: '2 days',
        rating: 4.2,
        feedback: 'Good quality wheat, minor packaging damage'
      },
      {
        id: '10',
        from: 'Kolhapur',
        to: 'Mumbai',
        status: 'delivered',
        progress: 100,
        estimatedDelivery: '2024-09-12',
        actualDelivery: '2024-09-13',
        crop: 'Sugarcane',
        quantity: 1500,
        unit: 'quintal',
        deliveryTime: '3 days',
        rating: 4.7,
        feedback: 'Excellent quality sugarcane, professional service'
      }
    ];

    res.json({
      success: true,
      data: shipmentHistory
    });
  } catch (error) {
    console.error('Get shipment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/shipments/overview
// @desc    Get shipment overview data
// @access  Private
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for shipment overview
    const overview = {
      totalShipments: 15,
      activeShipments: 5,
      completedShipments: 10,
      onTimeDelivery: 85,
      averageRating: 4.6,
      totalDistance: 1250,
      topRoutes: [
        {
          from: 'Nashik',
          to: 'Mumbai',
          count: 8,
          avgTime: '1.5 days'
        },
        {
          from: 'Pune',
          to: 'Nagpur',
          count: 4,
          avgTime: '2.5 days'
        }
      ],
      monthlyStats: [
        {
          month: 'September',
          completed: 12,
          revenue: 28500
        },
        {
          month: 'August',
          completed: 8,
          revenue: 19200
        }
      ]
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Get shipment overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

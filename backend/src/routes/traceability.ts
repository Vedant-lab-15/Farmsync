import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/traceability/:productId
// @desc    Get product traceability
// @access  Private
router.get('/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    // Comprehensive mock data for traceability
    const traceability = {
      productId,
      farm: 'Green Valley Farm, Nashik',
      farmer: 'Rajesh Kumar',
      harvestDate: '2024-09-15',
      quality: 'Grade A',
      certifications: ['Organic', 'Fair Trade', 'GAP Certified'],
      supplyChain: [
        {
          stage: 'Farm',
          location: 'Nashik, Maharashtra',
          date: '2024-09-15',
          status: 'Harvested',
          details: 'Fresh harvest from organic farm'
        },
        {
          stage: 'Collection Center',
          location: 'Nashik Collection Point',
          date: '2024-09-16',
          status: 'Quality Checked',
          details: 'Quality inspection passed'
        },
        {
          stage: 'Transport',
          location: 'Nashik to Mumbai',
          date: '2024-09-17',
          status: 'In Transit',
          details: 'Temperature controlled transport'
        },
        {
          stage: 'Market',
          location: 'Mumbai Wholesale Market',
          date: '2024-09-18',
          status: 'Delivered',
          details: 'Delivered to buyer'
        }
      ],
      tests: [
        {
          type: 'Pesticide Residue',
          result: 'Negative',
          date: '2024-09-16'
        },
        {
          type: 'Moisture Content',
          result: '12%',
          date: '2024-09-16'
        },
        {
          type: 'Quality Grade',
          result: 'A+',
          date: '2024-09-16'
        }
      ]
    };

    res.json({
      success: true,
      data: traceability
    });
  } catch (error) {
    console.error('Get traceability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/traceability
// @desc    Get all traceability records
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for all traceability records
    const traceabilityRecords = [
      {
        id: '1',
        productId: 'TOM-2024-001',
        crop: 'Tomato',
        batch: 'Batch A',
        status: 'Active',
        createdAt: '2024-09-15'
      },
      {
        id: '2',
        productId: 'RICE-2024-002',
        crop: 'Rice',
        batch: 'Batch B',
        status: 'Completed',
        createdAt: '2024-09-10'
      },
      {
        id: '3',
        productId: 'ONION-2024-003',
        crop: 'Onion',
        batch: 'Batch C',
        status: 'Active',
        createdAt: '2024-09-18'
      }
    ];

    res.json({
      success: true,
      data: traceabilityRecords
    });
  } catch (error) {
    console.error('Get traceability records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

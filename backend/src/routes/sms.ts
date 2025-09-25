import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/sms/send
// @desc    Send SMS notification
// @access  Private
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { phone, message } = req.body;

    // Mock SMS sending - will be replaced with real SMS service
    console.log(`Sending SMS to ${phone}: ${message}`);

    res.json({
      success: true,
      message: 'SMS sent successfully',
      data: {
        id: Date.now().toString(),
        phone,
        message,
        status: 'sent',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/sms/price-alert
// @desc    Send price alert SMS
// @access  Private
router.post('/price-alert', authMiddleware, async (req, res) => {
  try {
    const { phone, crop, price, market } = req.body;

    const message = `🔔 Price Alert! ${crop} is now at ₹${price}/kg in ${market}. Log in to your MarketStride account for more details.`;

    console.log(`Sending price alert to ${phone}: ${message}`);

    res.json({
      success: true,
      message: 'Price alert sent successfully',
      data: {
        id: Date.now().toString(),
        type: 'price_alert',
        phone,
        crop,
        price,
        market,
        status: 'sent',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Send price alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sms/history
// @desc    Get SMS history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // Comprehensive mock data for SMS history
    const smsHistory = [
      {
        id: '1',
        type: 'price_alert',
        phone: '+91-9876543210',
        message: '🔔 Price Alert! Tomato is now at ₹45/kg in Main Market.',
        status: 'sent',
        timestamp: '2024-09-20T10:30:00Z'
      },
      {
        id: '2',
        type: 'transaction',
        phone: '+91-9876543210',
        message: '✅ Transaction successful! Amount: ₹2,800. Txn ID: TXN123456',
        status: 'sent',
        timestamp: '2024-09-19T14:20:00Z'
      },
      {
        id: '3',
        type: 'weather',
        phone: '+91-9876543210',
        message: '🌧️ Weather Alert: Heavy rain expected tomorrow. Consider covering your crops.',
        status: 'sent',
        timestamp: '2024-09-18T08:15:00Z'
      }
    ];

    res.json({
      success: true,
      data: smsHistory
    });
  } catch (error) {
    console.error('Get SMS history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

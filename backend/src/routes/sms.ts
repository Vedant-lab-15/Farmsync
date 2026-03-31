import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/sms/send
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      res.status(400).json({ success: false, message: 'Phone and message are required' });
      return;
    }

    // In production: integrate Twilio here using process.env.TWILIO_* vars
    console.log(`[SMS] To: ${phone} | Message: ${message}`);

    res.json({
      success: true,
      message: 'SMS sent successfully',
      data: {
        id: Date.now().toString(),
        phone,
        message,
        status: 'sent',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/sms/price-alert
router.post('/price-alert', authMiddleware, async (req, res) => {
  try {
    const { phone, crop, price, market } = req.body;
    if (!phone || !crop || !market) {
      res.status(400).json({ success: false, message: 'phone, crop, and market are required' });
      return;
    }

    const message = `🔔 Price Alert! ${crop} is now at ₹${price}/kg in ${market}. Log in to FarmSync for more details.`;
    console.log(`[SMS] Price alert to ${phone}: ${message}`);

    res.json({
      success: true,
      message: 'Price alert sent successfully',
      data: { id: Date.now().toString(), type: 'price_alert', phone, crop, price, market, status: 'sent', timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Send price alert error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/sms/history
router.get('/history', authMiddleware, async (_req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { id: '1', type: 'price_alert', message: '🔔 Price Alert! Alphonso Mango is now at ₹150/kg in Ratnagiri Market.', status: 'sent', timestamp: '2025-09-20T10:30:00Z' },
        { id: '2', type: 'transaction', message: '✅ Transaction successful! Amount: ₹4,500. Txn ID: TXN123456', status: 'sent', timestamp: '2025-09-19T14:20:00Z' },
        { id: '3', type: 'weather', message: '🌧️ Weather Alert: Heavy rain expected tomorrow. Consider covering your crops.', status: 'sent', timestamp: '2025-09-18T08:15:00Z' },
      ],
    });
  } catch (error) {
    console.error('Get SMS history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

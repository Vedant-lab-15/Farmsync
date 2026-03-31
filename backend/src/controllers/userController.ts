import { Request, Response } from 'express';
import { User } from '../models/User';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, location, farmSize } = req.body;
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (farmSize !== undefined) updates.farmSize = farmSize;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          role: user.role,
          location: user.location || 'Not set',
          joinDate: user.createdAt,
          isVerified: user.isVerified,
        },
        stats: {
          totalListings: 12,
          activeListings: 8,
          soldProducts: 4,
          totalRevenue: 45231,
          monthlyRevenue: 12500,
          averageRating: 4.6,
          totalShipments: 15,
          completedShipments: 10,
        },
        recentActivity: [
          { id: '1', type: 'listing', title: 'New Mango Listing Created', description: 'Alphonso Mango - 300kg at ₹150/kg', timestamp: new Date().toISOString(), status: 'success' },
          { id: '2', type: 'shipment', title: 'Shipment Delivered', description: 'Tomato shipment to Mumbai completed', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'success' },
          { id: '3', type: 'payment', title: 'Payment Received', description: '₹4,500 received for Mango sale', timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'success' },
        ],
        achievements: [
          { id: '1', title: 'First Sale', description: 'Completed your first successful sale', icon: '🏆', unlockedAt: '2020-04-01' },
          { id: '2', title: 'Quality Farmer', description: 'Maintained 4.5+ star rating for 6 months', icon: '⭐', unlockedAt: '2021-01-15' },
          { id: '3', title: 'Volume Seller', description: 'Sold over 10 tons of produce', icon: '🚛', unlockedAt: '2022-08-20' },
        ],
      },
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

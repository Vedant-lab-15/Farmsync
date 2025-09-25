import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check if token exists in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Token is not valid. User not found.'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Middleware to check if user is farmer
export const farmerAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'farmer') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Farmer role required.'
    });
  }
};

// Middleware to check if user is broker
export const brokerAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'broker') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Broker role required.'
    });
  }
};

// Middleware to check if user is verified
export const verifiedUserAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Please verify your account first.'
    });
  }
};

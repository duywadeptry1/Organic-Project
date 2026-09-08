import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 1. Check if the header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // 2. Decode the token using our secret key
      const secret = process.env.JWT_SECRET || 'organi_default_secret_key_12345';
      const decoded = jwt.verify(token, secret);

      // 3. Find the user in the database, but DON'T return their password
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback for in-memory / mock mode
      }

      if (!req.user) {
        if (decoded.id === 'demo-admin-id') {
          req.user = { _id: decoded.id, name: 'Admin User', email: 'admin@organi.com', role: 'admin' };
        } else if (decoded.id === 'demo-farm-berryfield' || decoded.id?.includes('berryfield')) {
          req.user = {
            _id: decoded.id,
            name: 'BerryField Organic Farm',
            email: 'berryfield@organi.com',
            role: 'farm',
            brand: 'BerryField',
            bankInfo: { bankName: 'Chase Bank', accountNumber: '1904-8833-2101', accountName: 'BERRYFIELD FARMS LLC' },
          };
        } else if (decoded.id === 'demo-farm-greenearth' || decoded.id?.includes('greenearth')) {
          req.user = {
            _id: decoded.id,
            name: 'Green Earth Produce',
            email: 'greenearth@organi.com',
            role: 'farm',
            brand: 'Green Earth',
            bankInfo: { bankName: 'Wells Fargo', accountNumber: '4401-9923-1904', accountName: 'GREEN EARTH COOPERATIVE' },
          };
        } else {
          req.user = { _id: decoded.id, name: 'Demo Customer', email: 'user@organi.com', role: 'user' };
        }
      }

      // 4. Pass to the next middleware or controller
      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  res.status(401);
  throw new Error('Not authorized, no token provided');
});

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export default { protect, admin };


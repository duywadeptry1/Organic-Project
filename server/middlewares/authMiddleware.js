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
        req.user = {
          _id: decoded.id,
          name: decoded.id === 'demo-admin-id' ? 'Admin User' : 'Demo User',
          email: decoded.id === 'demo-admin-id' ? 'admin@organi.com' : 'user@organi.com',
          role: decoded.id === 'demo-admin-id' ? 'admin' : 'user',
        };
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: decoded.id === 'demo-admin-id' ? 'Admin User' : 'Demo User',
          email: decoded.id === 'demo-admin-id' ? 'admin@organi.com' : 'user@organi.com',
          role: decoded.id === 'demo-admin-id' ? 'admin' : 'user',
        };
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
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export default { protect, admin };


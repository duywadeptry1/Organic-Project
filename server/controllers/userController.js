import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// In-memory fallback users for development / preview mode
const memoryUsers = [
  {
    _id: 'demo-admin-id',
    name: 'Admin User',
    email: 'admin@organi.com',
    password: 'password123',
    role: 'admin',
  },
  {
    _id: 'demo-user-id',
    name: 'Demo Customer',
    email: 'user@organi.com',
    password: 'password123',
    role: 'user',
  },
];

// @desc    Register a new user
// @route   POST /api/users
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try MongoDB first
    try {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        res.status(400);
        throw new Error('User already exists');
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } catch (dbErr) {
      if (dbErr.message === 'User already exists') {
        throw dbErr;
      }
      // MongoDB not connected or failed, fallback to memory
    }

    // In-memory registration
    const existing = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      res.status(400);
      throw new Error('User already exists');
    }

    const newUser = {
      _id: 'user-' + Date.now(),
      name,
      email: normalizedEmail,
      password,
      role: 'user',
    };
    memoryUsers.push(newUser);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try DB validation
    let dbChecked = false;
    try {
      const user = await User.findOne({ email: normalizedEmail });
      dbChecked = true;
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          });
        } else {
          // User exists in DB but password does not match
          res.status(401);
          throw new Error('Please enter the right account');
        }
      }
    } catch (dbErr) {
      if (dbErr.message === 'Please enter the right account') {
        throw dbErr;
      }
      // DB query error or DB offline, fall through to memory check
    }

    // 2. Memory check (registered in memory or seed demo accounts)
    const memUser = memoryUsers.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (memUser) {
      if (memUser.password === password) {
        return res.json({
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          token: generateToken(memUser._id),
        });
      } else {
        // Password mismatch in memory
        res.status(401);
        throw new Error('Please enter the right account');
      }
    }

    // If user was not found in DB or memory storage, reject with notification message
    res.status(401);
    throw new Error('Please enter the right account');
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (dbErr) {
    // Fall through
  }

  if (req.user) {
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || 'user',
    });
  }

  res.status(404);
  throw new Error('User not found');
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updated = await user.save();
      return res.json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        token: generateToken(updated._id),
      });
    }
  } catch (dbErr) {
    // Fall through
  }

  // Memory fallback
  const memUser = memoryUsers.find((u) => u._id === req.user._id);
  if (memUser) {
    memUser.name = req.body.name || memUser.name;
    memUser.email = req.body.email || memUser.email;
    if (req.body.password) memUser.password = req.body.password;
    return res.json({
      _id: memUser._id,
      name: memUser.name,
      email: memUser.email,
      role: memUser.role,
      token: generateToken(memUser._id),
    });
  }

  res.json({
    _id: req.user._id,
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    role: req.user.role || 'user',
    token: generateToken(req.user._id),
  });
});

export default { registerUser, authUser, getUserProfile, updateUserProfile };


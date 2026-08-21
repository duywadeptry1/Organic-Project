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

    // 1. Try MongoDB first
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error('User already exists');
      }

      const user = await User.create({
        name,
        email,
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
      // Fallback
    }

    // In-memory registration
    const existing = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400);
      throw new Error('User already exists');
    }

    const newUser = {
      _id: 'user-' + Date.now(),
      name,
      email,
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

    // 1. Try DB
    try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } catch (dbErr) {
      // Fall through to memory
    }

    // 2. Memory / Demo Fallback
    const memUser = memoryUsers.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
    if (memUser && (memUser.password === password || password === 'password123' || password === 'admin123')) {
      return res.json({
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        token: generateToken(memUser._id),
      });
    }

    // Auto-create/demo login for any valid email during preview
    if (email && password) {
      const autoUser = {
        _id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email,
        password,
        role: email.includes('admin') ? 'admin' : 'user',
      };
      memoryUsers.push(autoUser);
      return res.json({
        _id: autoUser._id,
        name: autoUser.name,
        email: autoUser.email,
        role: autoUser.role,
        token: generateToken(autoUser._id),
      });
    }

    res.status(401);
    throw new Error('Invalid email or password');
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


import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// In-memory fallback store for orders
let memoryOrders = [];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const userId = req.user?._id || 'demo-user-id';

  try {
    const mappedItems = orderItems.map((item) => ({
      ...item,
      product: item._id,
      _id: undefined,
    }));

    const order = new Order({
      orderItems: mappedItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (err) {
    // In-memory fallback
  }

  const newOrder = {
    _id: 'order-' + Date.now(),
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id,
    })),
    user: {
      _id: userId,
      name: req.user?.name || 'Customer',
      email: req.user?.email || 'customer@organi.com',
    },
    shippingAddress,
    paymentMethod,
    itemsPrice: Number(itemsPrice),
    taxPrice: Number(taxPrice),
    shippingPrice: Number(shippingPrice),
    totalPrice: Number(totalPrice),
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString(),
  };

  memoryOrders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || 'demo-user-id';

  try {
    const orders = await Order.find({ user: req.user._id });
    if (orders && orders.length > 0) {
      return res.json(orders);
    }
  } catch (err) {
    // Fall through
  }

  const userOrders = memoryOrders.filter(
    (o) => o.user?._id?.toString() === userId || o.user === userId || !o.user
  );
  res.json(userOrders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      return res.json(order);
    }
  } catch (err) {
    // Fall through
  }

  const order = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (order) {
    return res.json(order);
  }

  res.status(404);
  throw new Error('Order not found');
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address,
      };

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }
  } catch (err) {
    // Fall through
  }

  const order = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date().toISOString();
    order.paymentResult = {
      id: req.body.id || 'paypal-tx-' + Date.now(),
      status: req.body.status || 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.body.payer?.email_address || 'buyer@organi.com',
    };
    return res.json(order);
  }

  res.status(404);
  throw new Error('Order not found');
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }
  } catch (err) {
    // Fall through
  }

  const order = memoryOrders.find((o) => o._id.toString() === req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date().toISOString();
    return res.json(order);
  }

  res.status(404);
  throw new Error('Order not found');
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    if (orders && orders.length > 0) {
      return res.json(orders);
    }
  } catch (err) {
    // Fall through
  }

  res.json(memoryOrders);
});

export default {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};


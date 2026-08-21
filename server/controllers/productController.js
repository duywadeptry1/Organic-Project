import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import initialProducts from '../data/products.js';

// In-memory products store for resilience when DB is in fallback mode
let memoryProducts = [...initialProducts];

// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keywordStr = req.query.keyword ? req.query.keyword.trim().toLowerCase() : '';
  const categoryFilter = req.query.category && req.query.category !== 'All' ? req.query.category : null;

  try {
    const keyword = keywordStr
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = categoryFilter ? { category: req.query.category } : {};
    const finalQuery = { ...keyword, ...category };

    let sortOrder = {};
    if (req.query.sort === 'price_asc') {
      sortOrder = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortOrder = { price: -1 };
    } else if (req.query.sort === 'name_asc') {
      sortOrder = { name: 1 };
    } else {
      sortOrder = { createdAt: -1 };
    }

    const totalMatchingProducts = await Product.countDocuments(finalQuery);
    const products = await Product.find(finalQuery)
      .sort(sortOrder)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (products && products.length > 0) {
      return res.json({
        products,
        page,
        pages: Math.ceil(totalMatchingProducts / pageSize),
        totalProducts: totalMatchingProducts,
      });
    }
  } catch (err) {
    // Fall through to in-memory fallback
  }

  // In-memory filtering and sorting fallback
  let filtered = memoryProducts.filter((p) => {
    const matchesKeyword = !keywordStr || (p.name && p.name.toLowerCase().includes(keywordStr));
    const matchesCategory = !categoryFilter || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchesKeyword && matchesCategory;
  });

  if (req.query.sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (req.query.sort === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalMatching = filtered.length;
  const paginated = filtered.slice(pageSize * (page - 1), pageSize * page);

  res.json({
    products: paginated,
    page,
    pages: Math.ceil(totalMatching / pageSize) || 1,
    totalProducts: totalMatching,
  });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    }
  } catch (err) {
    // Check in-memory store
  }

  const memProduct = memoryProducts.find((p) => p._id.toString() === req.params.id || p.id?.toString() === req.params.id);
  if (memProduct) {
    return res.json(memProduct);
  }

  res.status(404);
  throw new Error('Product not found');
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample Organic Item',
      price: 0,
      user: req.user?._id || 'demo-admin-id',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80',
      brand: 'Organi Farm',
      category: 'Vegetables',
      countInStock: 10,
      numReviews: 0,
      description: 'Sample organic description',
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (err) {
    // In-memory fallback
    const newProduct = {
      _id: 'prod-' + Date.now(),
      name: 'Sample Organic Item',
      price: 0,
      user: req.user?._id || 'demo-admin-id',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80',
      brand: 'Organi Farm',
      category: 'Vegetables',
      countInStock: 10,
      numReviews: 0,
      description: 'Sample organic description',
    };
    memoryProducts.unshift(newProduct);
    return res.status(201).json(newProduct);
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    }
  } catch (err) {
    // In-memory fallback
  }

  const idx = memoryProducts.findIndex((p) => p._id.toString() === req.params.id || p.id?.toString() === req.params.id);
  if (idx !== -1) {
    memoryProducts[idx] = {
      ...memoryProducts[idx],
      name,
      price: Number(price),
      description,
      image,
      brand,
      category,
      countInStock: Number(countInStock),
    };
    return res.json(memoryProducts[idx]);
  }

  res.status(404);
  throw new Error('Product not found');
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      return res.json({ message: 'Product removed' });
    }
  } catch (err) {
    // In-memory fallback
  }

  const idx = memoryProducts.findIndex((p) => p._id.toString() === req.params.id || p.id?.toString() === req.params.id);
  if (idx !== -1) {
    memoryProducts.splice(idx, 1);
    return res.json({ message: 'Product removed' });
  }

  res.status(404);
  throw new Error('Product not found');
});

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};


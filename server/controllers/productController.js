import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import initialProducts from '../data/products.js';

// In-memory products store for resilience when DB is in fallback mode
let memoryProducts = [...initialProducts];

// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  // Support custom pageSize/limit, allowing up to 1000 items per request
  const requestedPageSize = Number(req.query.pageSize) || Number(req.query.limit);
  const pageSize = requestedPageSize && requestedPageSize > 0
    ? Math.min(requestedPageSize, 1000)
    : 12; // Default to 12 items for clean shop grid
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
        pages: Math.ceil(totalMatchingProducts / pageSize) || 1,
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
  } else {
    // Default newest first (if has createdAt or just reverse)
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
  const {
    name = 'Sample Organic Item',
    price = 3.99,
    image = 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80',
    brand = 'Organi Farm',
    category = 'Vegetables',
    countInStock = 20,
    description = 'Certified fresh organic produce from local farms.',
  } = req.body || {};

  try {
    const product = new Product({
      name,
      price: Number(price),
      user: req.user?._id || 'demo-admin-id',
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      numReviews: 0,
      rating: 5,
      description,
    });

    const createdProduct = await product.save();
    // Also sync to memory
    memoryProducts.unshift(createdProduct);
    return res.status(201).json(createdProduct);
  } catch (err) {
    // In-memory fallback
    const newProduct = {
      _id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name,
      price: Number(price),
      user: req.user?._id || 'demo-admin-id',
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      numReviews: 0,
      rating: 5,
      description,
      createdAt: new Date().toISOString(),
    };
    memoryProducts.unshift(newProduct);
    return res.status(201).json(newProduct);
  }
});

// @desc    Bulk create products for testing or mass catalog import (up to 1000 items)
// @route   POST /api/products/bulk
// @access  Private/Admin
export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const { count = 10, category = 'All' } = req.body || {};
  const numToCreate = Math.min(Math.max(Number(count) || 10, 1), 1000);

  const sampleCategories = ['Fruits', 'Vegetables', 'Dairy', 'Bread'];
  const sampleImages = {
    Fruits: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80',
      'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&q=80',
      'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80',
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80',
    ],
    Vegetables: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80',
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&q=80',
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80',
    ],
    Dairy: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&q=80',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80',
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80',
    ],
    Bread: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
    ],
  };

  const adjectives = ['Organic', 'Farm-Fresh', 'Heritage', 'Artisanal', 'Regenerative', 'Sun-Ripened', 'Crisp', 'Golden', 'Wild', 'Pure'];
  const baseNames = {
    Fruits: ['Apples', 'Berries', 'Peaches', 'Pears', 'Figs', 'Plums', 'Cherries', 'Oranges', 'Grapes', 'Melons'],
    Vegetables: ['Kale', 'Radishes', 'Zucchini', 'Carrots', 'Heirloom Greens', 'Cucumbers', 'Beets', 'Peppers', 'Spinach', 'Asparagus'],
    Dairy: ['Farm Milk', 'Goat Cheese', 'Greek Yogurt', 'Salted Butter', 'Creamery Eggs', 'Almond Milk', 'Oat Creamer'],
    Bread: ['Sourdough Loaf', 'Seeded Baguette', 'Brioche Buns', 'Rye Bread', 'Focaccia', 'Rustic Ciabatta', 'Multi-Seed Rolls'],
  };

  const newItems = [];
  const currentTotal = memoryProducts.length;

  for (let i = 0; i < numToCreate; i++) {
    const itemNum = currentTotal + i + 1;
    const cat = category !== 'All' && sampleCategories.includes(category)
      ? category
      : sampleCategories[i % sampleCategories.length];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const names = baseNames[cat] || baseNames.Vegetables;
    const baseName = names[Math.floor(Math.random() * names.length)];
    const name = `${adj} ${baseName} #${itemNum}`;

    const imgs = sampleImages[cat] || sampleImages.Vegetables;
    const image = imgs[Math.floor(Math.random() * imgs.length)];
    const price = Number((Math.random() * 8 + 1.5).toFixed(2));
    const countInStock = Math.floor(Math.random() * 50) + 10;

    newItems.push({
      name,
      price,
      user: req.user?._id || 'demo-admin-id',
      image,
      brand: 'Organi Farm',
      category: cat,
      countInStock,
      numReviews: Math.floor(Math.random() * 30),
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      description: `Premium ${adj.toLowerCase()} ${baseName.toLowerCase()} grown with regenerative organic farming practices.`,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    const inserted = await Product.insertMany(newItems);
    inserted.forEach((item) => memoryProducts.unshift(item));
    return res.status(201).json({
      message: `Successfully created ${inserted.length} products`,
      count: inserted.length,
      totalCatalogCount: memoryProducts.length,
    });
  } catch (err) {
    // In-memory fallback
    const memCreated = newItems.map((item, idx) => ({
      _id: 'prod-bulk-' + Date.now() + '-' + idx,
      ...item,
    }));
    memoryProducts.unshift(...memCreated);
    return res.status(201).json({
      message: `Successfully created ${memCreated.length} products in memory catalog`,
      count: memCreated.length,
      totalCatalogCount: memoryProducts.length,
    });
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
      // Also delete from memory
      const mIdx = memoryProducts.findIndex((p) => p._id.toString() === req.params.id);
      if (mIdx !== -1) memoryProducts.splice(mIdx, 1);
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
  bulkCreateProducts,
  updateProduct,
  deleteProduct,
};


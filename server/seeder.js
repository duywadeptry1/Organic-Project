import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import products from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@organi.com',
      password: 'password123',
      role: 'admin',
    });

    await User.create({
      name: 'Demo User',
      email: 'user@organi.com',
      password: 'password123',
      role: 'user',
    });

    await User.create({
      name: 'BerryField Organic Farm',
      email: 'berryfield@organi.com',
      password: 'password123',
      role: 'farm',
      brand: 'BerryField',
      bankInfo: {
        bankName: 'Chase Bank',
        accountNumber: '1904-8833-2101',
        accountName: 'BERRYFIELD FARMS LLC',
        routingNumber: '021000021',
      },
    });

    await User.create({
      name: 'Green Earth Produce',
      email: 'greenearth@organi.com',
      password: 'password123',
      role: 'farm',
      brand: 'Green Earth',
      bankInfo: {
        bankName: 'Wells Fargo',
        accountNumber: '4401-9923-1904',
        accountName: 'GREEN EARTH COOPERATIVE',
        routingNumber: '121000248',
      },
    });

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully! ✅');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const products = require('./src/data/products')
const connectDB = require('./src/config/db');

// Load environment variables so we can connect to the database
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const importData = async () => {
  try {
    // 1. Wipe the database completely clean to prevent duplicates
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Create an Admin user
    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@organi.com',
        password: 'password123',
        role: 'admin',
      }
    ]);

    // 3. Get the ID of the newly created Admin
    const adminUserId = createdUsers[0]._id;

    // 4. Attach that Admin ID to every single product in our mock data
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUserId };
    });

    // 5. Insert the products into the database
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error.message}`);
    process.exit(1);
  }
};

// Check the command line arguments to see if we want to import or destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
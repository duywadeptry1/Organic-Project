import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('ℹ️ No MONGO_URI provided in environment. Running with in-memory store.');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      family: 4,
    });
    console.log(`Connected successfully to MongoDB ✅: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}. Running with in-memory store.`);
    throw error;
  }
};

export default connectDB;
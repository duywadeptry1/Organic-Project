import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('ℹ️ No MONGO_URI provided in environment. Running with in-memory store.');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
      family: 4,
    });
    console.log(`Connected successfully to MongoDB ✅: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}. Running with in-memory store.`);
  }
};

export default connectDB;


import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    // ✅ Safety check (VERY IMPORTANT)
    if (!mongoURI) {
      throw new Error("MONGO_URI not found in .env file");
    }

    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);

    // Optional: connection listeners
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
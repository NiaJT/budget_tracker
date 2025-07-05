import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
  const url = process.env.MONGODB_URI;
  try {
    await mongoose.connect(url);
    console.log("Database connected Successfully");
  } catch (error) {
    console.log("Database connection failed");
    console.log("error:", error.message);
    process.exit(1);
  }
};

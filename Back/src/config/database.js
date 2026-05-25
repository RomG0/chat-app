import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "chat-app" });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;

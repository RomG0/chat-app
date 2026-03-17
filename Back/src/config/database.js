import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
  }
};

export default connectDB;

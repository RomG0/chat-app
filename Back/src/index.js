import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoute.js";
import chatRoutes from "./routes/chatRoute.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

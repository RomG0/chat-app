import express from "express";
import https from "https";
import cors from "cors";
import { Server } from "socket.io";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import { initializeSocket } from "./config/socket.js";
import cookieParser from "cookie-parser";
import fs from "fs";

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://localhost:30173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: "https://localhost:30173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

initializeSocket(io);

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });

import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { connect } from "mongoose";

export const initializeSocket = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  let connectedUsers = [];
  const adminSockets = new Set();

  const emitToAdmins = (event, data) => {
    for (const socketId of adminSockets) {
      io.to(socketId).emit(event, data);
    }
  };

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id + " " + socket.user.username);
    connectedUsers.push({
      username: socket.user.username,
      socketId: socket.id,
    });
    if (socket.user.isAdmin) {
      // YZ: does the server can trust what't in the socket?
      adminSockets.add(socket.id);
    }
    emitToAdmins("connectedUsers", connectedUsers);

    socket.on("disconnect", () => {
      console.log(
        "User disconnected: " + socket.id + " " + socket.user.username,
      );

      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id,
      );
      if (socket.user.isAdmin) {
        adminSockets.delete(socket.id);
      }
      emitToAdmins("connectedUsers", connectedUsers);
    });

    socket.on("getConnectedUsers", () => {
      if (socket.user.isAdmin) {
        socket.emit("connectedUsers", connectedUsers);
      } else {
        socket.emit("error", { message: "Unauthorized" });
      }
    });

    socket.on("sendMessage", async (data) => {
      const { content } = data;
      if (
        !content ||
        typeof content !== "string" ||
        content.trim().length === 0
      ) {
        return socket.emit("error", { message: "Message content is required" });
      }

      try {
        const newMessage = new Message({
          content: content.trim(),
          sender: socket.user._id,
        });
        await newMessage.save();
        const populatedMessage = await Message.findById(
          newMessage._id,
        ).populate("sender", "username isAdmin");
        io.emit("newMessage", populatedMessage);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Error sending message" });
      }
    });
  });
};

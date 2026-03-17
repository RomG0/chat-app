import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticateToken, sendMessage);
router.get("/messages", authenticateToken, getMessages);

export default router;

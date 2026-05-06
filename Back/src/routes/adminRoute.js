import express from "express";
import {
  getAllUsers,
  deleteUser,
  giveAdmin,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getUsers", requireAdmin, getAllUsers);
router.put("/user/:id", requireAdmin, giveAdmin);
router.delete("/user/:id", requireAdmin, deleteUser);

export default router;

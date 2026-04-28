import express from "express";
import { getUser, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/user{/:id}", (req, res) => {
  getUser(req, res);
});

router.delete("/user/:id", (req, res) => {
  deleteUser(req, res);
});

export default router;

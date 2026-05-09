import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

export const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.userId).select("isAdmin");
      if (!user) return res.status(401).json({ message: "User no longer exists" });
      if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });
      next();
    } catch (err) {
      return res.status(500).json({ message: "Authorization check failed" });
    }
  });
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // user contains userId and username
    next();
  });
};

export const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    User.findById(req.user.userId)
      .select("isAdmin")
      .then((user) => {
        if (user.isAdmin) {
          next();
        } else {
          res.status(403).json({ message: "Admin access required" });
        }
      });
  });
};

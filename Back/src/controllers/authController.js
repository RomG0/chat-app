import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../services/authService.js";

export async function register(req, res) {
  const { username, password } = req.body;
  const hashPass = await hashPassword(password);
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      const newUser = new User({ username, password: `${hashPass}` });
      await newUser.save();
      const token = jwt.sign(
        {
          userId: newUser._id,
          username: newUser.username,
          isAdmin: newUser.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
      res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          // secure: true,
          // sameSite: "Strict",
          maxAge: 3600000,
        })
        .json({
          message: "User registered successfully, logging in...",
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const ok = await verifyPassword(password, user.password);
    if (!user || !ok) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        // sameSite: "Strict",
        maxAge: 3600000,
      })
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
}

export async function logout(req, res) {}

// export async function getUser(req, res) {
//   try {
//     const { token } = req.body;
//     if (!token) {
//       return res.status(401).json({ message: "Missing Token" });
//     }
//     let decoded;
//     try {
//       decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(403).json({ message: "Invalid or expired token" });
//     }
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.status(200).json({ user });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving user", error: err.message });
//   }
// }

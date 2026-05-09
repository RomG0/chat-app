import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../services/authService.js";

export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      const hashPass = await hashPassword(password);
      const newUser = new User({ username, password: hashPass });
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
          secure: true,
          sameSite: "Strict",
          maxAge: 3600000,
        })
        .json({
          message: "User registered successfully, logging in...",
          user: { username: newUser.username, isAdmin: newUser.isAdmin },
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
    if (!user || !(await verifyPassword(password, user.password))) {
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
        secure: true,
        sameSite: "Strict",
        maxAge: 3600000,
      })
      .json({
        message: "Login successful",
        user: { username: user.username, isAdmin: user.isAdmin },
      });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out" });
}

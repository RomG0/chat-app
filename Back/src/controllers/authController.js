import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      const newUser = new User({ username, password, userId: 2 });
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully, logging in...",
        token: jwt.sign(
          { userId: newUser.userId, username: newUser.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        ),
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
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
}

import user from "../models/User.js";

export const getUser = async (req, res) => {
  const userId = req.params.id ? Number(req.params.id) : undefined;

  try {
    if (userId) {
      const user = await user.findOne({ userId: userId }).select("-password");
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      const users = await user.find().select("-password");
      res.status(200).json({ users });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id ? Number(req.params.id) : undefined;

  try {
    if (userId) {
      const user = await user.findOneAndDelete({ userId: userId });
      if (user) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid user ID" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

import user from "../models/User.js";

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (userId) {
      const qUser = await user.findByIdAndDelete(userId);
      if (qUser) {
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

export const giveAdmin = async (req, res) => {
  const userId = req.params.id;

  try {
    if (userId) {
      const qUser = await user.findByIdAndUpdate(userId, { isAdmin: true });
      if (qUser) {
        res.status(200).json({ message: "User is now an admin" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid user ID" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await user.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

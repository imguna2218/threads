import mongoose from "mongoose";
import User from './models/userModel.js' // Correct path to your User model

const getSuggestedUsers = async (req, res) => {
  try {
    const randUsers = await User.aggregate([{ $sample: { size: 5 } }]);

    if (randUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(randUsers);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export default getSuggestedUsers;

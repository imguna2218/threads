import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

const getUserProfile = async (req, res) => {
  const { query } = req.params;
  //fetching either with username or userId

  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-password -updatedAt");
    } else {
      user = await User.findOne({ username: query }).select("-password -updatedAt");
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {

    res.status(500).json({ error: 'Server error' });
  }
}

const signupUser = async (req, res) => {
  try {

    const { name, email, username, password } = req.body;

    // Check if password is defined;

    // Check if email or username already exists
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Return success response
    if (newUser) {

      generateTokenAndSetCookie(newUser._id, res);
      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic
      });
    } else {
      res.status(400).json({ error: 'Failed to create user' });
    }
  } catch (err) {

    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password || '');

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // If login is successful, generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Send success response with user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic
    });

  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
}

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if users exist before proceeding
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot follow or unfollow yourself' });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: 'User unfollowed successfully' });
    } else {
      // Follow user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (req.params.id !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      }
      const result = await cloudinary.uploader.upload(profilePic);
      profilePic = result.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].userId": user._id,
          "replies.$[reply].username": user.username,
          "replies.$[reply].name": user.name,
          "replies.$[reply].userProfilePic": user.profilePic
        }
      },
      {
        arrayFilters: [{ "reply.userId": userId }]
      }
    )

    // password is null 
    user.password = null;

    res.status(200).json(user);

  } catch (err) {

    res.status(500).json({ error: err.message });
  }
}

const getSuggested = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile, getSuggested };

// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
    //Do we need to check for existing user before creating?

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    if(req.user.id !== req.params.id){
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.log('delete', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

exports.signup = async (req, res) => {
  try {
    // Remove manual hashing of the password
    const newUser = new User({
      ...req.body,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ user: savedUser });
  } catch (error) {
    console.log('error from signup', error);
    res.status(500).json({ message: 'Error signing up', error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.followUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json({ message: 'User followed' });
      } else {
        res.status(400).json({ message: 'You are already following this user' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error following user', error });
    }
  };
  
  exports.unfollowUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
  
      if (user.followers.includes(req.user.id)) {
        await user.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({ message: 'User unfollowed' });
      } else {
        res.status(400).json({ message: 'You are not following this user' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error unfollowing user', error });
    }
  };
  
  exports.getFollowers = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const followers = await User.find({ _id: { $in: user.followers } }).select(
        '-password'
      );
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching followers', error });
    }
  };
  

  exports.getFollowing = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const following = await User.find({ _id: { $in: user.following } }).select(
        '-password'
      );
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching following', error });
    }
  };

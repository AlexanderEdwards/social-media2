// controllers/likeController.js

const Post = require('../models/Post');
const Like = require('../models/Like');

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await Like.findOne({
      post: req.params.postId,
      user: req.user.id,
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    const newLike = new Like({
      post: req.params.postId,
      user: req.user.id,
    });

    await newLike.save();
    post.likes.push(newLike._id);
    await post.save();

    res.status(201).json({ message: 'Post liked', like: newLike });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await Like.findOne({
      post: req.params.postId,
      user: req.user.id,
    });

    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }

    await Like.findByIdAndDelete(existingLike._id);
    post.likes.pull(existingLike._id);
    await post.save();

    res.status(204).json({ message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
};

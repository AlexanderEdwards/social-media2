const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      user: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().populate('user', '-password');
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
};

exports.getPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('user', '-password');
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error });
    }
  };

exports.updatePost = async (req, res) => {
try {
    const post = await Post.findById(req.params.id);
    if (!post) {
    return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
    ).populate('user', '-password');
    res.status(200).json(updatedPost);
} catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
}
};

exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this post' });
      }
  
      await Post.findByIdAndDelete(req.params.id);
      res.status(204).json({ message: 'Post deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  };
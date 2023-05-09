// routes/postRoutes.js

const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// Post routes
router.post('/', authMiddleware.protect, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPost);
router.put('/:id', authMiddleware.protect, postController.updatePost);
router.delete('/:id', authMiddleware.protect, postController.deletePost);

module.exports = router;

// routes/commentRoutes.js

const express = require('express');
const router = express.Router({ mergeParams: true });

const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

// Comment routes
router.post('/', authMiddleware.protect, commentController.createComment);
router.get('/', commentController.getAllComments);
//router.get('/:commentId', commentController.getComment);
router.put('/:commentId', authMiddleware.protect, commentController.updateComment);
router.delete('/:commentId', authMiddleware.protect, commentController.deleteComment);

module.exports = router;

// routes/likeRoutes.js

const express = require('express');
const router = express.Router({ mergeParams: true });

const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/auth');

// Like routes
router.post('/', authMiddleware.protect, likeController.likePost);
router.delete('/:likeId', authMiddleware.protect, likeController.unlikePost);

module.exports = router;

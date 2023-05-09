// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');


console.log('getUser', authMiddleware.protect)
// User routes
router.post('/', userController.createUser);
router.get('/:id', authMiddleware.protect, userController.getUser);
router.put('/:id', authMiddleware.protect, userController.updateUser);
router.delete('/:id', authMiddleware.protect, userController.deleteUser);

// Authentication routes
router.post('/auth/signup', userController.signup);
router.post('/auth/login', userController.login);

// Follower routes
router.post('/:id/follow', authMiddleware.protect, userController.followUser);
router.delete('/:id/follow/:followerId', authMiddleware.protect, userController.unfollowUser);
router.get('/:id/followers', authMiddleware.protect, userController.getFollowers);
router.get('/:id/following', authMiddleware.protect, userController.getFollowing);

module.exports = router;

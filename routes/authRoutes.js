const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const loginLimiter = require('../middleware/loginLimiter')

// Register a new user
router.post('/register', authController.register);

// Login user and generate access token
router.post('/login', loginLimiter, authController.login);

// Refresh access token using refresh token
router.get('/refresh', authController.refreshToken);

// Logout user and clear the refresh token
router.post('/logout', authController.logout);

module.exports = router;

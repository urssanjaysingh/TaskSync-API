const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT'); // Assuming you have a middleware to verify JWT

// Register a new user
router.post('/register', authController.register);

// Login user and generate access token
router.post('/login', authController.login);

router.post('/refresh-token', verifyJWT, authController.refreshToken); // Add this route

// Logout user and clear the refresh token
router.post('/logout', authController.logout);

module.exports = router;

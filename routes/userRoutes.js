const express = require('express');
const userController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT'); 

const router = express.Router();

router.get('/all', userController.getAllUsers);

// Protect these routes with JWT authentication
router.use(verifyJWT);

// GET user profile
router.get('/profile', userController.getUser);

// Update user profile
router.put('/update', userController.updateProfile);

module.exports = router;

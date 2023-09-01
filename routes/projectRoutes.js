const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyJWT = require('../middleware/verifyJWT'); // Assuming you have a middleware to verify JWT

router.get('/all', projectController.getAllProjects);

// Protect these routes with JWT authentication
router.use(verifyJWT);

// Create a new project
router.post('/create', projectController.createProject);

// Get a specific project by ID
router.get('/:id', projectController.getProject);

// Update a project by ID
router.put('/:id', projectController.updateProject);

// Delete a project by ID
router.delete('/:id', projectController.deleteProject);

module.exports = router;

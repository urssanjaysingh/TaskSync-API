const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyJWT = require('../middleware/verifyJWT'); // Assuming you have a middleware to verify JWT

// Get all tasks
router.get('/all', taskController.getAllTasks);

// Protect these routes with JWT authentication
router.use(verifyJWT);

// Create a new task
router.post('/create', taskController.createTask);

// Get a specific task by ID
router.get('/:id', taskController.getTask);

// Update a task by ID
router.put('/:id', taskController.updateTask);

// Delete a task by ID
router.delete('/:id', taskController.deleteTask);

module.exports = router;

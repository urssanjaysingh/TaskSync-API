const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verifyJWT = require('../middleware/verifyJWT'); // Assuming you have a middleware to verify JWT

// Get all posts
router.get('/all', postController.getAllPosts);

// Protect these routes with JWT authentication
router.use(verifyJWT);

// Create a new post
router.post('/create', postController.createPost);

// Get a specific post by ID
router.get('/:id', postController.getPost);

// Update a post by ID
router.put('/:id', postController.updatePost);

// Delete a post by ID
router.delete('/:id', postController.deletePost);

// Create a comment on a post
router.post('/:id/comments', postController.createComment);

// Delete a comment on a post
router.delete('/:postId/comments/:commentId', postController.deleteComment);

// Toggle like on a post
router.post('/:id/toggle-like', postController.toggleLike);

module.exports = router;

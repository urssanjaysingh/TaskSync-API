const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorUsername: {   
        type: String,   
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Define the Post schema
const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorAvatar: {
        type: String,
    },
    authorUsername: {   
        type: String,   
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema]  // Use the comment schema defined above
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;

const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    created_at: Date,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        created_at: Date
    }]
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    created_at: Date,
    profile: {
        first_name: String,
        last_name: String,
        avatar: String,
        bio: String,
        social_links: {
            linkedin: String,
            github: String,
            website: String
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const User = require('../models/User');

const userController = {};

userController.getUser = async (req, res) => {
    try {
        const { username } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};

userController.updateProfile = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming userId is included in the token payload
        const { name, bio, avatar } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile information
        user.profile.name = name;
        user.profile.bio = bio;
        user.profile.avatar = avatar;
        await user.save();

        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Profile update failed' });
    }
};

module.exports = userController;

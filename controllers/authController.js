const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {};

authController.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email is already in use
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Registration failed.' });
    }
};

authController.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Create access token
            const accessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m'
            });

            // Create refresh token
            const refreshToken = jwt.sign({ userId: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d'
            });

            // Attach the refresh token to the user document
            user.refreshToken = refreshToken;
            await user.save();

            // Send access and refresh tokens along with user information
            res.json({
                accessToken,
                refreshToken,
                user: { username: user.username, email: user.email }
            });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

authController.refreshToken = async (req, res) => {
    try {
        const { username } = req.user; // Provided by verifyJWT middleware

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user || user.refreshToken !== req.cookies.jwt) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m'
        });

        res.json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

authController.logout = async (req, res) => {
    try {
        // Clear the refresh token or perform any necessary logout actions
        res.clearCookie('jwt');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
};

module.exports = authController;

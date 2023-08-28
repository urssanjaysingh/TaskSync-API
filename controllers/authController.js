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
        const user = await User.findOne({ username }).exec();

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Create access token
            const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m'
            });

            // Create refresh token
            const refreshToken = jwt.sign({ id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d'
            });

            // Create secure cookie with refresh token 
            res.cookie('jwt', refreshToken, {
                httpOnly: true, //accessible only by web server 
                secure: true, //https
                sameSite: 'None', //cross-site cookie 
                maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
            })

            // Send accessToken and userId
            res.json({ accessToken, userId: user._id });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

authController.refreshToken = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const user = await User.findOne({ username: decoded.username }).exec()

            if (!user) return res.status(401).json({ message: 'Unauthorized' })

            // Generate a new access token
            const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15m'
            });

            res.json({ accessToken });
        }
    )
}

authController.logout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
};

module.exports = authController;

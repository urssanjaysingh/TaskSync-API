const User = require('../models/User');
const path = require('path'); // Import the 'path' module
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const userController = {};

// Set up Multer storage for avatar image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage }).single('avatar'); // 'avatar' is the field name in the form

userController.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Handle avatar image upload using Multer
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading avatar:', err);
        return res.status(500).json({ message: 'Error uploading avatar' });
      }

      const { first_name, last_name, bio, linkedin, github, website } = req.body;

      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        user.profile.first_name = first_name;
        user.profile.last_name = last_name;
        user.profile.bio = bio;
        user.profile.social_links.linkedin = linkedin;
        user.profile.social_links.github = github;
        user.profile.social_links.website = website;

        // Handle avatar image upload to Cloudinary
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, { folder: 'avatars' });

          // Transform the Cloudinary URL by appending transformation parameters
          const cloudinaryBaseUrl = 'https://res.cloudinary.com/dewblf95z/image/upload/';
          const transformedAvatarUrl = `${cloudinaryBaseUrl}w_100,h_100,r_max,bo_2px_solid_black/${result.public_id}.${result.format}`;

          user.profile.avatar = transformedAvatarUrl;
        }

        await user.save();

        return res.json({
          message: 'Profile updated successfully',
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profile: user.profile
          }
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

userController.getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you get the user ID from your authentication middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: {
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        avatar: user.profile.avatar,
        bio: user.profile.bio,
        social_links: user.profile.social_links
      },
      // Other properties you want to include
    };

    return res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

userController.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email profile'); // Specify fields to retrieve
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = userController;

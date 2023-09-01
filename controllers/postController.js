const Post = require('../models/Post');
const User = require('../models/User');

const postController = {};

postController.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const author = req.user.id;

        // Assuming you have a way to fetch the author's username based on the author's ID
        const authorUser = await User.findById(author);

        if (!authorUser) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const newPost = new Post({
            author,
            authorUsername: authorUser.username,
            authorAvatar: authorUser.profile.avatar, 
            content
        });

        const savedPost = await newPost.save();
        const allPosts = await Post.find(); // Fetch all posts after creating the new one
        return res.json({ savedPost, allPosts });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

postController.getPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

postController.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()

        return res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

postController.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                content
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

postController.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

postController.createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { author, content } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Assuming you have a way to fetch the author's username based on the author's ID
        const authorUser = await User.findById(author);

        if (!authorUser) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const newComment = {
            author,
            authorUsername: authorUser.username,  // Add the author's username
            content
        };

        post.comments.push(newComment);
        await post.save();

        return res.json(post);
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

postController.deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments = post.comments.filter(comment => comment.id !== commentId);
        await post.save();

        return res.json(post);
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const addLikeToPost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        post.likes.push(userId);
        await post.save();
    } catch (error) {
        throw error;
    }
};

const removeLikeFromPost = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        post.likes = post.likes.filter(like => like.toString() !== userId);
        await post.save();
    } catch (error) {
        throw error;
    }
};

postController.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(userId)) {
            // Remove like if already liked
            await removeLikeFromPost(postId, userId);
        } else {
            // Add like if not already liked
            await addLikeToPost(postId, userId);
        }

        const updatedPost = await Post.findById(postId); // Fetch the updated post
        return res.json(updatedPost);
    } catch (error) {
        console.error('Error toggling like:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = postController;

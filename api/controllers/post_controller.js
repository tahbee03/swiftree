const Post = require("../models/Post");
const mongoose = require("mongoose");

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Get specific post
const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such post!" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "No such post!" });
        else return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Create new post
const createPost = async (req, res) => {
    try {
        const { author_id, content } = req.body;
        const post = await Post.create({ author_id, content });
        return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Update specific post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such post!" });

        const post = await Post.findByIdAndUpdate({ _id: id }, { ...req.body });
        if (!post) return res.status(404).json({ message: "No such post!" });
        else return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Delete specific post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such post!" });

        const post = await Post.findOneAndDelete({ _id: id });
        if (!post) return res.status(404).json({ message: "No such post!" });
        else return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Export functions to be used in other modules
module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
const Post = require("../models/Post");
const mongoose = require("mongoose");

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({createdAt: -1});
        res.status(200).json(posts);
    } catch(err) {
        res.status(400).json({error: err});
    }
};

// Get specific post
const getPost = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such post!"});

    const post = await Post.findById(id);
    
    if(!post) res.status(404).json({error: "No such post!"});
    else res.status(200).json(post);
};

// Create new post
const createPost = async (req, res) => {
    const {author_id, content} = req.body;

    try {
        const post = await Post.create({author_id, content}); // Create a new entry
        res.status(200).json(post);
    } catch(err) {
        res.status(400).json({error: err});
    }
};

// Update specific post
const updatePost = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such post!"});
    
    const post = await Post.findByIdAndUpdate({_id: id}, {...req.body});
    if(!post) res.status(404).json({error: "No such post!"});
    else res.status(200).json(post);
};

// Delete specific post
const deletePost = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such post!"});

    const post = await Post.findOneAndDelete({_id: id});

    if(!post) res.status(404).json({error: "No such post!"});
    else res.status(200).json(post);
};

// Export functions to be used in other modules
module.exports = {getPosts, getPost, createPost, updatePost, deletePost};
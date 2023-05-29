const express = require("express");
const {getPosts, getPost, createPost, deletePost} = require("../controllers/post_controller");

const router = express.Router(); 

// Get all posts
router.get("/", getPosts);

// Get specific post
router.get("/:id", getPost);

// Create new post
router.post("/", createPost);

// Delete specific post
router.delete("/:id", deletePost);

module.exports = router; // Export the router so that if can be used in server.js
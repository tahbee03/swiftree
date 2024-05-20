const express = require("express");
const { getUsers, getUser, userLogin, userSignUp, updateUser, deleteUser } = require("../controllers/user_controller");

const router = express.Router();

// Get all users
router.get("/", getUsers);

// Get specific user (via ID)
router.get("/:id", getUser);

// Login functionality
router.post("/login", userLogin)

// Sign up functionality
router.post("/sign-up", userSignUp);

// Update specific user
router.patch("/:id", updateUser);

// Delete specific user
router.delete("/:id", deleteUser);

module.exports = router; // Export the router so that it can be used in server.js
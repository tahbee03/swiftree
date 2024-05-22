const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { updateImage } = require("../cloudinary");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Get specific user
const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such user!" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "No such user!" });
        else return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Login functionality
const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) return res.status(404).json({ message: "Username not found!" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(404).json({ message: "Incorrect password!" });

        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload, secret, options
        return res.status(200).json({
            id: user._id,
            username: user.username,
            display_name: user.display_name,
            pfp: user.image.url,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Sign up functionality
const userSignUp = async (req, res) => {
    try {
        const { email, username, display_name, password } = req.body;

        const ematch = await User.find({ email });
        if (ematch.length != 0) return res.status(400).json({ message: "Email already in use!" });

        const umatch = await User.find({ username: username.toLowerCase() });
        if (umatch.length != 0) return res.status(400).json({ message: "Username already in use!" })

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            username: username.toLowerCase(),
            display_name,
            password: hash,
            image: { public_id: "", url: "/account_icon.png" }
        });
        const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload, secret, optionsconst token = createToken(user._id, user.email, user.username);
        return res.status(200).json({
            id: user._id,
            username: user.username,
            display_name: user.display_name,
            pfp: user.image.url,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Update specific user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such user!" });

        if (req.body.mode === "IMAGE") req.body = await updateImage(req.body.content);
        else if (req.body.mode === "PASSWORD") {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.content.password, salt);
            req.body = { password: hash };
        }
        else req.body = req.body.content;

        const user = await User.findByIdAndUpdate({ _id: id }, { ...req.body });
        if (!user) return res.status(404).json({ message: "No such user!" });
        else return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Delete specific user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No such user!" });

        const user = await User.findOneAndDelete({ _id: id });
        if (!user) return res.status(404).json({ message: "No such user!" });
        else return res.status(200).json({ message: "User successfully deleted!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error encountered." });
    }
};

// Export functions to be used in other modules
module.exports = { getUsers, getUser, userLogin, userSignUp, updateUser, deleteUser };
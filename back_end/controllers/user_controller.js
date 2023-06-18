const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (id, email, username) => {
    return jwt.sign({id, email, username}, process.env.TOKEN_SECRET, { expiresIn: "1d" }); // payload | secret | options
};

// Get all users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});

    if(users.length == 0) res.status(400).json({error: "There are no users!"});
    else res.status(200).json(users);
};

// Get specific user
const getUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    const user = await User.findById(id);

    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

/// Login functionality
const userLogin = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});
        if(!user) throw Error("Username not found!");

        const match = await bcrypt.compare(password, user.password);
        if(!match) throw Error("Incorrect password!");
        
        const token = createToken(user._id, user.email, user.username);
        res.status(200).json({username, token});

    } catch(err) {
        res.status(400).json({error: err.message});
    }

};

// Sign up functionality
const userSignUp = async (req, res) => {
    const {email, username, password} = req.body;

    const ematch = await User.find({email});
    // console.log(ematch);
    if(ematch.length != 0) return res.status(400).json({error: "Email already in use!"});

    const umatch = await User.find({username});
    // console.log(umatch);
    if(umatch.length != 0) return res.status(400).json({error: "Username already in use!"})

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({email, username, password: hash});
        const token = createToken(user._id, user.email, user.username);
        res.status(200).json({username, token});
    } catch(err) {
        console.log(err.message);
        res.status(400).json({error: err});
    }
};

// Update specific user
const updateUser = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});
    
    const user = await User.findByIdAndUpdate({_id: id}, {...req.body});
    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

// Delete specific user
const deleteUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    const user = await User.findOneAndDelete({_id: id});

    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

// TODO: Create and export controller functions for login and sign up functionalities
// TODO: Hash passwords in sign up functionality with bcrypt
// TODO: Implement input validation for login and sign up functionalities

// Export functions to be used in other modules
module.exports = {getUsers, getUser, userLogin, userSignUp, updateUser, deleteUser};
const User = require("../models/User")
const mongoose = require("mongoose");

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
    // TODO: Implement
};

// Sign up functionality
const userSignUp = async (req, res) => {
    const {email, username, password, currentUser} = req.body;

    try {
        const user = await User.create({email, username, password, currentUser});
        res.status(200).json(user);
    } catch(err) {
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
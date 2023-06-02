const User = require("../models/User")
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
    const users = await User.find({}).sort({createdAt: -1});

    if(users.length == 0) res.status(400).json({error: "There are no users!"});
    else res.status(200).json(users);
};

const getUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    const user = await User.findById(id);

    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

const createUser = async (req, res) => {
    const {email, username, password, currentUser} = req.body;

    try {
        const user = await User.create({email, username, password, currentUser});
        res.status(200).json(user);
    } catch(err) {
        res.status(400).json({error: err});
    }
};

const updateUser = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});
    
    const user = await User.findByIdAndUpdate({_id: id}, {...req.body});
    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

const deleteUser = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: "No such user!"});

    const user = await User.findOneAndDelete({_id: id});

    if(!user) res.status(404).json({error: "No such user!"});
    else res.status(200).json(user);
};

module.exports = {getUsers, getUser, createUser, updateUser, deleteUser};
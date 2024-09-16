const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/User');

//register user
exports.registerUser = async(req,res) => {
    try {
        const {username,password} = req.body;
        const hashedPassowrd = await bcrypt.hash(password, 10);
        const user = new User({username, password:hashedPassowrd});
        await user.save();
        res.status(201).json({message: "User Registered Successfully"});

    } catch (err){
        res.status(500).json({message: "Error Registering User"});
    }
}

exports.loginUser = async(req,res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({ error: "Invalid credentials"});
        }
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET);
        res.json({token, username: user.username})
    } catch(err) {
        res.status(500).json({message: "Error Logging In"});
    }
}

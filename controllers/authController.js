const User = require('../models/userModel');
var jwt = require('jsonwebtoken');
const { use } = require('../routes/userRoutes');

exports.signUp = async (req,res)=>{
    const user = new User({
        userName: req.body.userName,
        password: req.body.password,
        passwordConform: req.body.passwordConform,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        location: req.body.location,
      });

    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, {expiresIn: process.env.Token_EXPIRES_IN});
    try {
        const newUser = await user.save();
        res.status(201).json({message:"User created",token,  data: newUser});

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
};

exports.login = async (req,res)=>{
    const {email , password} = req.body;
    if(email&& password){
        if(email === User.email && password === User.password){
            res.status(200).json({message:"You are logged in"})
    }
}}
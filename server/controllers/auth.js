const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticationController = async (req, res) => {
    try{
        const {username, password} = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash  = await bcrypt.hash(password, salt);
        const user = await User.findOne({username:username})
        if (!user){
            const newUser = new User({
                username: username,
                password: passwordHash
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({id:savedUser._id}, process.env.JWT_SECRET);
            res.status(200).json({user:savedUser,token:token,msg:"User created successfully"});
        }
        else{
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch){
                return res.status(400).json({msg:"Invalid Password"});
            }
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            delete user.password;
            res.status(200).json({user:user,token:token,msg:"User logged in successfully"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = authenticationController;
const User = require('../models/User');

const searchUser = async (req,res) => {
    try {
        const {username} = req.params
        const users = await User.find({username:{$regex:username,$options:"i"}})
        res.status(200).json({users})
    } catch(e){
        res.status(400).json({message:"search failed"})
    }

}

module.exports = {searchUser}
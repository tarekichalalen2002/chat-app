const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    sender:{
        type:String,
        required:true,
    },
    chat:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:new Date(),
    }
});

module.exports = mongoose.model("Message",MessageSchema);
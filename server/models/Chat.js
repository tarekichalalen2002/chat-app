const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        required:true,
        unique:true,
        min:3,
        max:20,
    },
    chatMessages:{
        type:Array,
        default:[],
        required:true,
    },
    chatMembers:{
        type:Array,
        required:true,
    },
    lastMessage:{
        type:String,
        default:"",
    },
    lastMessageSender:{
        type:String,
        default:"",
    },
    lastMessageTime:{
        type:String,
        default:"",
    },
    createdAt:{
        type:Date,
        default:new Date(),
    }
})


// export default mongoose.model("Chat",ChatSchema);

module.exports = mongoose.model("Chat",ChatSchema);
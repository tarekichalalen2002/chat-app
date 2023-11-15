const Message = require('../models/Message');


const getChatMessages = async (req,res) => {
    const {chatId} = req.params;
    try{
        const Reversedmessages = await Message.find({chat:chatId}).sort({ createdAt: -1 }).limit(20).populate("sender","username");
        const messages = Reversedmessages.reverse();
        if (messages.length > 0) {
            res.status(200).json({messages:messages})
        } else {
            res.status(200).json({message:"No messages found"})
        }
    } catch(e) {
        res.status(400).json({message:e.message})
    }
}

// NOT ROUTED YET

const deleteMessage = async (req,res) => {
    try{
        const {messageId} = req.params;
        await Message.deleteOne({_id:messageId});
        res.status(200).json({message:"Message deleted successfully"})
    } catch(e) {
        res.status(400).json({message:e.message})
    }
}

const deleteAllMessages = async (req,res) => {
    try{
        const deletedMessages = await Message.deleteMany({});
        if (deletedMessages.deletedCount === 0) {
            res.status(404).json({message:"No messages found"})
        } else {
            res.status(200).json({message:"All messages deleted"})
        }
    } catch(e) {
        res.status(400).json({message:e.message})
    }
}

const deleteChatMessages = async (req,res) => {
    try{
        const {chatId} = req.params
        const deletedMessages = await Message.deleteMany({chat:chatId});
        if (deletedMessages.deletedCount === 0){
            res.status(404).json({message:"No messages found"})
        } else {
            res.status(200).json({message:"All messages deleted of the chat were deleted"})
        }
    } catch(e) {
        re.status(400).json({message:e.message})
    }
}

module.exports = {
    getChatMessages,
    deleteMessage,
    deleteAllMessages,
    deleteChatMessages,
};
const Chat = require('../models/Chat');
const Message = require('../models/Message')

const getChat = async (req, res) => {
    try{
        const chatId = req.params.chatId;
        const chat = await Chat.findOne({_id:chatId});
        res.status(200).json({chat:chat})
    } catch(e){
        res.status(500).json({message: e.message});
    }
}

const createChat = async (req, res) => {
    try{
        const {
            chatName,
            chatMessages,
            chatMembers,
            lastMessage,
            lastMessageSender,
            lastMessageTime,
        } = req.body
        const newChat = new Chat({
            chatName,
            chatMessages,
            chatMembers,
            lastMessage,
            lastMessageSender,
            lastMessageTime,
        })
        const savedChat = await newChat.save();
        res.status(201).json({chat:savedChat,message:`chat ${chatName} created successfully`})
    } catch(e) {
        res.status(501).json({message: e.message});
    }
}

const addUserToChat = async (req ,res) => {
    try{
        const {chatId, userId} = req.body
        const chat = await Chat.findOne({_id:chatId});
        if (chat.chatMembers.includes(userId)) {
            res.status(200).json({message:'user already in chat'})
        } else {
            chat.chatMembers.push(userId)
            const savedChat = await chat.save()
            res.status(201).json({chat:savedChat,message:"user added to chat successfuly"})
        }
    } catch(e){
        res.status(403).json({message:e.message})
    }
}

const removeUserFromChat = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        const chat = await Chat.findOne({ _id: chatId });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        if (!chat.chatMembers || !Array.isArray(chat.chatMembers)) {
            return res.status(400).json({ message: 'Invalid chat format' });
        }
        if (chat.chatMembers.includes(userId)) {
            chat.chatMembers = chat.chatMembers.filter(member => member !== userId);
            await chat.save();
            res.status(200).json({ chat: chat, message: 'User was removed successfully from the chat' });
        } else {
            res.status(200).json({message:"user not in chat"})
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getChatsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const chats = await Chat.find({ chatMembers: { $in: [userId] } });
        if (chats.length === 0) {
            res.status(200).json({message:'This use does not appear in any chat'})
        } else {
            res.status(200).json({chats:chats})
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const deleteChat = async (req, res) => {
    try{
        const {chatId} = req.params
        await Message.deleteMany({chat:chatId});
        const deletedChat = await Chat.deleteOne({_id:chatId})
        console.log(deletedChat.deletedCount)
        if (deletedChat.deletedCount === 1) {
            res.status(203).json({ message: 'Chat was deleted successfully' });
        } else {
            res.status(404).json({ message: 'Chat not found' });
        }
    } catch(e) {
        res.status(400).json({message:e.message})
    }
}


const chatControllers = {
    getChat,
    createChat,
    deleteChat,
    addUserToChat,
    removeUserFromChat,
    getChatsByUserId
}

module.exports = chatControllers;
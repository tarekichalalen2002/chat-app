const express = require('express');
const {getChat,createChat,deleteChat,addUserToChat,removeUserFromChat, getChatsByUserId} = require('../controllers/chats.js');
const chatRouter = express.Router();


chatRouter.get('/:chatId', getChat)
chatRouter.post('/create', createChat)
chatRouter.delete('/delete/:chatId', deleteChat)
chatRouter.patch('/addUser',addUserToChat)
chatRouter.patch('/removeUser',removeUserFromChat)
chatRouter.get("/user/:userId",getChatsByUserId)


module.exports = chatRouter;
const express = require('express');
const messagesRouter = express.Router();
const {getChatMessages,deleteMessage,deleteAllMessages,deleteChatMessages} = require('../controllers/messages.js');

messagesRouter.get("/:chatId",getChatMessages)
messagesRouter.delete("/:messageId",deleteMessage)
messagesRouter.delete("/",deleteAllMessages)
messagesRouter.delete("/:chatId",deleteChatMessages)


module.exports = messagesRouter;
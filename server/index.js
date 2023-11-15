const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const path = require('path');
const authRouter = require('./routes/auth.js');
const chatRouter = require('./routes/chats.js');
const searchRouter = require('./routes/search.js');
const messageRouter = require('./routes/messages.js');
const Message = require("./models/Message");;

dotenv.config();

const app = express();
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});

const wss = new WebSocket.Server({ server });

app.use(express.json({ limit: '30mb', extended: true }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Add 'PATCH' to the list of allowed methods
  origin: 'http://localhost:5173' // Replace with your actual client origin
}));

app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/search', searchRouter);
app.use('/messages',messageRouter);
app.use(express.static(path.join(__dirname, 'client/build')))

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    wss.clients.forEach(async (client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ text: parsedMessage.text, sender: parsedMessage.sender }));
        try{
          const db_message = await new Message({
            text:parsedMessage.text,
            sender:parsedMessage.sender,
            chat:parsedMessage.chat,
          });
          const savedMessage = await db_message.save();
        } catch(e) {
          console.log(e.message);
        }
      }
    });
  });
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error(`Error connecting to MongoDB: ${error}`);
});
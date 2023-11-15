import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatSettings from './ChatSettings';
import state from '../state';
import { useSnapshot } from 'valtio';
import {AiOutlineSend} from 'react-icons/ai'
import {motion} from 'framer-motion'
import BubblesModel from '../canvas';
import { Canvas } from '@react-three/fiber'

const ChatApp = () => {
  const snap = useSnapshot(state);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [oldMessages,setOldMessages] = useState([])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
  
    socket.onmessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (data.text) {
            const receivedMessage = data;
            setChatHistory((prevChatHistory) => [...prevChatHistory, receivedMessage]);
            console.log("received : ",receivedMessage.sender);
          }
        } else {
          console.error("Received data is not a string:", event.data);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
  
    return () => {
      socket.close();
    };
  }, [snap.currentChat]);
  

  // RETREIVE THE OLD MASSAGES FROM THE DATABASE
  useEffect(() => {
    const getOldMessages = async () => {
      const response = await fetch(
        `http://localhost:3001/messages/${snap?.currentChat?._id}`,
        {
          method:"GET",
          header:{
            "Content-Type":"application/json"
          }
        }
      )
      if (response.status === 200) {
        const {messages} = await response.json()
        console.log(messages);
        setOldMessages(messages)
      }
    }
    getOldMessages()
  },[snap.currentChat])


  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const socket = new WebSocket('ws://localhost:3001');
      socket.onopen = () => {
        const messageObject = { text: message, sender: snap?.user?._id ,chat: snap?.currentChat?._id};
        socket.send(JSON.stringify(messageObject));
        setMessage('');
        socket.close();
      };
    }
  };
  return (
    <div className='w-[100vw] h-[100vh] grid grid-cols-9'>
      <ChatList />
        <div className='w-full col-span-5 relative'>
          <div className='flex flex-col h-[70vh] gap-2 w-full overflow-y-scroll p-3'>
            <div
            className='w-full flex flex-col justify-center items-center text-purple-700'
            >
              <h1 className='font-bold text-3xl text-center'>
                {snap?.currentChat?.chatName}
              </h1>
              <p
              className='font-semibold text-lg text-center'
              >{snap?.currentChat?.chatMembers.map((user) => (user === snap?.user?._id ? 'You' : user) + ", ")}</p>
            </div>
            {!oldMessages ? (
              <div>
                <p className='w-full text-gray-600 font-semibold text-xl text-center'>No messages yet</p>
                <Canvas 
                className='absolute top-0 left-0 bottom-0 z-[-1]'
                >
                  <ambientLight intensity={2} />
                  <directionalLight color="white" intensity={2} position={[5, 10, 5]} />
                  <motion.mesh
                    initial={{ opacity: 0, y: -100 , rotation: [0, 0, 0] }}
                    animate={{ opacity: 1, y: 0, rotation: [1.3, 1.4, 1] }}
                  >
                    <BubblesModel />
                  </motion.mesh>
                  
                </Canvas>
              </div>
            ): (
              <>
                {oldMessages.map((msg,index) => (
                  <div key={index}
                  className={`
                  w-full flex flex-col
                  items-start ${msg.sender === snap?.user?._id && ' items-end '}
                  `}
                >
                  <motion.p className={`
                  ${msg.sender === snap?.user?._id ? ' text-white bg-purple-800 ' : ' bg-gray-300 '}}
                  p-2 rounded-lg w-[fit-content] max-w-[66%] overflow-auto
                  `}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {msg.text}
                  </motion.p>
                </div>
                ))}
              </>
            )}
            {chatHistory.map((msg, index) => (
              <div key={index}
                className={`
                w-full flex flex-col
                items-start ${msg.sender === snap?.user?._id && ' items-end '}
                `}
              >
                <motion.p className={`
                ${msg.sender === snap?.user?._id ? ' text-white bg-purple-800 ' : ' bg-gray-300 '}}
                p-2 rounded-lg w-[fit-content] max-w-[66%] overflow-auto
                `}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {msg.text}
                </motion.p>
              </div>


            ))}
          </div>
          <form onSubmit={handleSendMessage} className='flex gap-2 w-full absolute bottom-16'>
            <div className='relative w-full'>
            <input
              className='border-2 border-purple-800 w-full px-2 py-3 rounded-lg relative'
              value={message}
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
              <button 
              className='absolute right-0 top-0 bottom-0 text-2xl text-white bg-purple-800 rounded-r-lg p-3'
              type='submit'><AiOutlineSend /> </button>
            </div>
            
          </form>
        </div>
      <ChatSettings />
    </div>
  );
};

export default ChatApp;

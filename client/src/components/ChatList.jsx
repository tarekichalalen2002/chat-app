import React,{useState,useEffect} from 'react'
import {AiOutlinePlus,AiOutlineClose} from 'react-icons/ai'
import state from '../state'
import {motion} from 'framer-motion'
import { useSnapshot } from 'valtio'

function ChatList() {
  let snap = useSnapshot(state)
  const [isAddChatVisible,setIsAddChatVisible] = useState(false)
  const [createdChats,setCreatedChats] = useState(0)
  const [newChatName, setNewChatName] = useState("")
  const [chatCreationError,setChatCreationError] = useState("")
  const [chats,setChats] = useState(snap?.chats)
  useEffect(() => {
    if (snap.user){
      const fetchChats = async () => {
        const response = await fetch(
          `http://localhost:3001/chat/user/${snap.user._id}`,
          {
            method:'GET',
            headers:{
              "Content-Type":"application/json"
            },
          }
        )
        if (response.status === 200){
          const {chats} = await response.json()
          console.log(chats);
          state.chats = chats
          state.currentChat = chats[0]
          setChats(chats)
        } else {
          const {message} = await response.json()
          console.log(message);
        }
      }
      fetchChats()
    }
  },[createdChats])
  const handleCreateChat = async () => {
    if (newChatName){
      const response = await fetch(
        "http://localhost:3001/chat/create",
        {
          method:'POST',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            chatName:newChatName,
            chatMessages:[],
            chatMembers:[snap?.user?._id],
          })
        }
      )
      if (response.status === 201) {
        const {message,chat} = await response.json()
        setChats([...chats,chat])
        setCreatedChats(createdChats + 1)
        state.currentChat = chat
        setIsAddChatVisible(false)
        setNewChatName("")
        setChatCreationError("")
      } else {
        const {message} = await response.json()
        setChatCreationError(message)
      }
    } else{
      setChatCreationError("Please enter a name")
    }
  }

  return (
    <div
    className='
    h-full overflow-y-scroll flex flex-col gap-2 col-span-2
    '        
    >
      {
        isAddChatVisible ? (
          <motion.div
          className='flex flex-col gap-3 py-4 px-3 '
          initial={{opacity:0,x:-10}}
          animate={{x:0,opacity:1}}
          transition={{duration:0.5,type:'spring'}}
          >
            <label
            className='font-bold text-lg text-purple-700'
            htmlFor='new-chat-name'
            >
              Add Chat: 
            </label>
            <span className='relative'>
              <input 
                id='new-chat-name'
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="New chat name ..."
                className='p-2 border-2 border-purple-700 rounded-xl w-full'
              />
              <button
              className='absolute font-bold text-xl text-red-500 right-3 top-2.5'
              onClick={() => setIsAddChatVisible(false)}
              >
                <AiOutlineClose />
              </button>
              <button
              className='absolute font-bold text-xl text-green-500 right-8 top-2.5'
              onClick={handleCreateChat}
              >
                
                <AiOutlinePlus />
              </button>
            </span>
            <p className='text-xs text-red-600 font-semibold'>
              {chatCreationError}
            </p>
          </motion.div>
          
        ) : (
        <div
        className='flex justify-between px-5 py-3 items-center'
        >
          <h1 className='text-2xl font-bold'>My Chats</h1>
          <button 
          className='px-3 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-800
          ease-in-out duration-300
          '
          onClick={() => setIsAddChatVisible(true)}
          >
              <AiOutlinePlus className='text-2xl'/>
          </button>
        </div>
        )
      }

        

        <div
          className='flex flex-col gap-0 mt-2'
        >
          {
            chats ? (
            <>
              {chats?.map((chat,index) => {
                return (
                  <div
                  className={`flex justify-between px-3 py-2 items-center
                  cursor-pointer
                  `}
                  key={index}
                  onClick={() => {
                    state.currentChat = chat
                  }}
                  >
                    <div className='flex flex-col gap-3'>
                      <h4 className='font-semibold'>
                        {chat.chatName}
                      </h4>
                      <p className='text-gray-700 text-xs'>
                        {chat.lastMessageText}
                      </p>
                    </div>
                    <div>
                      <div className={`bg-blue-600 rounded-full w-2 h-2 ${!chat.isNotified && "hidden"}`}/>
                    </div>
                  </div>
                )
              })}
            </>
            ) : (
              <div
              className='font-semibold px-3 py-4 text-gray-500 w-full text-center'
              >
                You have no chats ...
              </div>
            )
          }
          
        </div>
    </div>
  )
}

export default ChatList
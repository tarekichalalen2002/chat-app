import React,{useState,useEffect} from 'react'
import { useSnapshot } from 'valtio'
import state from '../state'
import {AiOutlineDown,AiOutlineDelete,AiOutlinePlus} from 'react-icons/ai'
import {GrLogout} from 'react-icons/gr'
import {motion} from 'framer-motion'

function ChatSettings() {
    const snap = useSnapshot(state)
    const [isPeopleOpen, setIsPeopleOpen] = useState(false)
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [searchResults,setSearchResults] = useState([])


    // ADD USER INTO THE CURRENT CHAT
    const addUserToChat = async (userId) => {
        const response = await fetch(
            `http://localhost:3001/chat/addUser`,
            {
                method:'PATCH',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    chatId:snap.currentChat?._id,
                    userId:userId,
                })
            }
        )
        if (response.status === 201) {
            const {chat} = await response.json()
            state.currentChat = chat
        } else {
            console.log('error in adding user to chat');
        }
    }
    const getSearchResults = async (search) => {
        if (search) {
            const response = await fetch(
                `http://localhost:3001/search/${search}`,
                {
                    method:'GET',
                    headers:{
                        "content-type":"application/json",
                    },
                }
            )
            if (response.status === 200) {
                const data = await response.json()
                setSearchResults(data.users)
            }
        }
    }
    useEffect(() => {
        getSearchResults(search)
        if (!search) {
            setSearchResults([])
        }
    }, [search])
  return (
    <div
    className='flex flex-col gap-4 p-3 overflow-y-scroll h-[100vh] col-span-2'
    >
        <div className='flex flex-col items-center '>
            {
                snap.currentChat?.chatName && (
                    <div className='font-semibold py-2 w-3/4 flex justify-center border rounded-xl border-gray-800 text-lg'>
                    {snap?.currentChat?.chatName}
                    </div>
                )
            }
        </div>
        <div
        className='flex flex-col mt-5'
        >
            <div
            className='w-full flex justify-between h-10 items-center 
            font-semibold cursor-pointer hover:bg-gray-100 ease-in-out duration-300 px-3 py-7
            text-lg  text-purple-700
            '
            onClick={() => setIsPeopleOpen(!isPeopleOpen)}
            >
                <span>People</span>
                <AiOutlineDown />
            </div>
            {isPeopleOpen && (
                <motion.div
                    initial={{y:-30,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{duration:0.5,type:'spring'}}
                >
                    <div className='font-semibold py-4 px-3 flex 
                    justify-between items-center
                    gap-3
                    '>
                        Add:
                        <input 
                        type='text'
                        className='p-2 border border-gray-800 rounded-xl '
                        placeholder='Search for a users  . . .'
                        value={search}
                        onChange={(e) =>setSearch(e.target.value)}
                        />
                    </div>
                    {!searchResults.length>0 && search ? (
                        <div className='flex px-3 py-2 items-center'>
                        No user found
                        </div>
                        
                    ):(
                        <div>
                            {searchResults.map((user,index) =>  (
                            <div
                            key={index}
                            className='flex px-2 py-2 items-center justify-between font-bold'
                            >
                                {user?.username}
                                <div className='p-2 hover:bg-gray-300 ease-in-out duration-300 cursor-pointer rounded-2xl'
                                onClick={() => {addUserToChat(user?._id);setSearch('')}}
                                >
                                    <AiOutlinePlus />
                                </div>
                            </div>)
                            )}
                        </div>
                    )}
                    
                    {snap?.currentChat?.chatMembers?.map((user,index) => (
                        <div
                        className='flex justify-between px-3 py-2 items-center'
                        key={index}
                        >
                            <div className='flex flex-col gap-3'>
                                <h4 className='font-semibold'>
                                    {user === snap?.user?._id ? 'You' : user}
                                </h4>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            <div
            className='w-full flex justify-between h-10 items-center 
            font-semibold cursor-pointer hover:bg-gray-100 ease-in-out duration-300 px-3 py-7
            text-lg text-purple-700
            '
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            >
                <span>Options</span>
                <AiOutlineDown />
            </div>
            {isOptionsOpen && (
                <motion.div className='flex flex-col font-semibold gap-4 pl-5'
                    initial={{y:-30,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{duration:0.5,type:'spring'}}
                >
                    <div className='flex items-center justify-between cursor-pointer'>
                        Quit Chat
                        <GrLogout />
                    </div>
                    <div className='flex items-center justify-between cursor-pointer'>
                        Delete Chat
                        <AiOutlineDelete />
                    </div>
                </motion.div>
            )}

        </div>
    </div>
  )
}

export default ChatSettings
import React from 'react'
import { useState,useEffect } from 'react'
import state from '../state'

function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(
            "http://localhost:3001/auth",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            }
        )
        if (response.status === 200) {
            const {token,msg,user} = await response.json()
            console.log(msg)
            console.log(user)
            state.user = user
            state.token = token
        } else {
            const {msg} = await response.json()
            console.log(msg);
            setError(msg)
        }
    }
  return (
    <div
    className='w-[100vw] h-[100vh] flex justify-center pt-[10%]'
    >
        <div
        className='flex-col items-center gap-10'
        >
            <h1 className='text-purple-800 font-bold text-3xl mb-10'>
                Welcome To Tarek's Chat App
            </h1>
            <form
            className='flex flex-col gap-8 mt-10 items-center'
            onSubmit={handleSubmit}
            >
                <div className='grid grid-cols-4 items-center gap-3'>
                    <label
                    htmlFor='username'
                    className='col-span-1 font-semibold text-xl'
                    >username: </label>
                    <input 
                    id='username'
                    className='col-span-3 p-2 border-2 border-purple-800 rounded-md'
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='username'
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-3'>
                    <label
                    htmlFor='password'
                    className='col-span-1 font-semibold text-xl'
                    >password: </label>
                    <input 
                    id='password'
                    className='col-span-3 p-2 border-2 border-purple-800 rounded-md'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='password'
                    />
                </div>
                <p
                className='text-red-500'
                >
                    {error}
                </p>

                <button
                    className='bg-purple-800 text-white font-bold py-2 rounded-md w-1/2'
                >
                    Enter Chat
                </button>
            </form>
        </div>
    </div>
  )
}

export default LoginForm
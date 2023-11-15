import { useState,useEffect } from 'react'
import ChatApp from './components/Chat'
import LoginForm from './components/LoginForm'
import state from './state'
import { useSnapshot } from 'valtio'


function App() {
  const snap = useSnapshot(state)
  return (
    <>
    {
      // state.user ? <ChatApp /> : <LoginForm />
      <ChatApp />
    }
    </>
  )
}

export default App

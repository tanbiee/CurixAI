import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import Login from './Login'
import './App.css'
import { MyContext } from './MyContext'
import { useState, useEffect } from 'react'
import { v1 as uuidv1 } from "uuid"

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("curixai_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats , setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([])
  const providerValue = {
    user, setUser,
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat, 
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValue}>
        {user ? (
          <>
            <Sidebar />
            <ChatWindow />
          </>
        ) : (
          <Login />
        )}
      </MyContext.Provider>
    </div>
  )
}

export default App

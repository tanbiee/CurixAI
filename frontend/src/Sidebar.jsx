import React from 'react'
import './Sidebar.css'
import { useEffect } from 'react';
import { useContext } from 'react';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from 'uuid';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
export default function Sidebar() {
  const {user, allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030";

  const getAllThreads =async()=>{
    if (!user) return;
    try{
      const response = await fetch(`${API_URL}/api/thread?userId=${user.id}`);
      const res = await response.json();
      const filterData = res.map(thread=>({
        threadId: thread.threadId, 
        title: thread.title
        
      }))
      console.log(filterData);
      setAllThreads(filterData);
      //threadId, title
    }catch(err){
      console.log(err);
    }
  };
  useEffect(()=>{
    getAllThreads();
  }, [currThreadId])
  
  const createNewChat=()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }
  const changeThread=async(newThreadId)=>{
    setCurrThreadId(newThreadId);

    try{
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}?userId=${user.id}`)
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null)
    }catch(err){
      console.error(err);
    }
  }
  const deleteThread = async(threadId)=>{
    try{
      const response = await fetch(`${API_URL}/api/thread/${threadId}?userId=${user.id}`,{method: "DELETE"})
      const res = await response.json();
      console.log(res);
      //update threads re-render
      setAllThreads(prev=>prev.filter(thread=>thread.threadId !==threadId));
      if(threadId === currThreadId){
        createNewChat();
      }

    }catch(err){
      console.error(err);
    }
  }
  return (
    <div className='sidebar'>
        
        <button className='bg-black' onClick={createNewChat}>
            <EditNoteOutlinedIcon className='logo'/>
            <i>New Chat</i>
        </button>
        
        <ul className="history">
            {
              allThreads?.map((thread, idx)=>(
                <li key={idx}
                  onClick={()=>changeThread(thread.threadId)}
                  className={thread.threadId===currThreadId? "highlighted": " "}
                >{thread.title}<DeleteOutlineOutlinedIcon className='delete' 
                  style={{color:'red'}} onClick={(e)=> {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                />
                </li>
              ))
            }
        </ul>

        
        <div className="sign">
            <p>by Shalini &hearts;</p>
        </div>
    </div>
  )
}

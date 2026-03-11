import React, { useContext, useEffect, useState } from 'react'
import "./Chatwindow.css"
import Chat from './Chat.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import { MyContext } from './MyContext.jsx';
import { v4 as uuidv4 } from 'uuid';
import { ScaleLoader } from "react-spinners"
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

export default function ChatWindow() {
  const {user, setUser, prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats,setNewChat} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030";

  useEffect(() => {
    if (!currThreadId) {
      setCurrThreadId(uuidv4());
    }
  }, []);
  
  const getreply= async()=>{
    setNewChat(false);
    setLoading(true)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        threadId: currThreadId,
        message: prompt
        
      })
    }
    try{
      const response = await fetch(`${API_URL}/api/chat`, options);
      if(!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        alert("Error: " + (errorData.error || "Failed to get response"));
        setLoading(false);
        return;
      }
      const res = await response.json();
      console.log("API Response:", res);

      if(res.reply) {
        setReply(res.reply);
      } else {
        console.warn("No reply in response");
        alert("No response from API");
      }

    }catch(err){
      console.error("Fetch error:", err);
      alert("Network error: " + err.message);
    }
    setLoading(false);
  }
  useEffect(()=>{
    if(prompt && reply){
      setPrevChats(prevChats => {
        return [
          ...prevChats,
          {
            role: "user",
            content: prompt
          },
          {
            role: "assistant",
            content: reply
          }
        ];
      })
    }
    setPrompt("");
  }, [reply]);
  
  const handleProfileClick =()=>{
    setIsOpen(!isOpen);
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("curixai_user");
  }
  return (
    <div className='chatWindow'>
      <div className="navbar">
        <span>CurixAI <ExpandMoreIcon/></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          {user && user.picture ? (
            <img src={user.picture} alt="Profile" style={{ width: '100%', borderRadius: '50%' }} />
          ) : (
            <span><PersonIcon /></span>
          )}
        </div>
      </div>
      {
        isOpen && 
        <div className='dropDown'>
          <div className="dropDownItem"><SettingsOutlinedIcon/> settings</div>
          <div className="dropDownItem"><UpgradeOutlinedIcon/>Upgrade plan</div>
          <div className="dropDownItem" onClick={handleLogout}><LoginOutlinedIcon/>Log out</div>
        </div>
      }
      <Chat></Chat>
      <ScaleLoader color='white' loading={loading}/>
      <div className="chatInput">
        <div className="userInput">
          <input type="text" placeholder='Ask anything' value={prompt}            
            onChange={(e)=>setPrompt(e.target.value)}
            onKeyDown={(e)=>e.key== 'Enter'? getreply(): ''}
          >
           
          </input>
          <div className="submit"  onClick={getreply}><SendIcon/></div>
        </div>
        <p className="info">
          CurixAI can make mistakes. Check important info. SeeCookie Preference.
        </p>
      </div>
      
    </div>
  )
}

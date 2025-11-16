import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useContext } from 'react'
import { MyContext } from './MyContext'
import ReactMarkdown from 'react-markdown'
import rehypeHightlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css" //to give  the assistant code styling of the code 


//for fomatting the msges we will use two packages
//react-markdown(proper formatting of information)
//rehype-highlight(use for syntex highlight)
export default function Chat() {
  const {newChat, prevChats, reply} = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(()=>{
    if(newChat || !reply) {
      setLatestReply(null);
    }
  }, [newChat, reply])

  useEffect(()=>{
    if(!reply) return;

    const content = reply.split(" "); //individual words
    let currentIdx = 0;
    // start with empty string so typing UI appears
    setLatestReply("");

    const interval = setInterval(()=>{
      currentIdx++;
      setLatestReply(content.slice(0, currentIdx).join(" "));
      if(currentIdx >= content.length) {
        clearInterval(interval);
        // typing finished -> hide typing so history shows full assistant reply
        setLatestReply(null);
      }
    }, 40);

    return ()=>clearInterval(interval);
    //latest reply seperate => typing effect create
  }, [reply])


  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}
      <div className="chats">
        {
          prevChats?.slice(0,-1).map((chat, idx) => (
            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{chat.content}</ReactMarkdown>
              )}
            </div>
          ))
        }
        {
          prevChats?.length > 0 && (
            latestReply !== null ? (
              <div className="gptDiv" key={"typing"}>
                <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{latestReply}</ReactMarkdown>
              </div>
            ) : (
              // show the last assistant message from history when not typing
              (() => {
                const last = prevChats[prevChats.length - 1];
                return last && last.role === 'assistant' ? (
                  <div className="gptDiv" key={"non-typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{last.content}</ReactMarkdown>
                  </div>
                ) : null;
              })()
            )
          )
        }

        

      </div>
    </>
  )
}

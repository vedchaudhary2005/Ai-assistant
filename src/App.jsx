import React, { useContext, useEffect } from 'react'
import "./App.css"
import va from "./assets/pic1.png"
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from './context/UserContext';
import speakimg from "./assets/speak1.gif"
import aigif from "./assets/aiVoice.gif"

function App() {
  let {recognition,speaking,setSpeaking,prompt,response,setPrompt,setResponse}=useContext(datacontext)
   
  useEffect(() => {
    // Production-safe protection (no window.close())
    
    // Disable right click
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable dev tools shortcuts (without breaking site)
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // Simple console blocking
    const noop = () => {};
    ['log', 'debug', 'info', 'warn', 'error'].forEach(method => {
      window.console[method] = noop;
    });

    // Clear console periodically
    const consoleClear = setInterval(() => {
      console.clear();
    }, 2000);

    // Disable text selection
    document.onselectstart = () => false;
    document.ondragstart = () => false;

    return () => {
      clearInterval(consoleClear);
    };
  }, []);

  return (
    <div className='main'>
      <img src={va} alt="" id="shifra"/>
      <span>I'm Cryptron, Your Virtual Assistant.</span>
      {!speaking?
      <button onClick={()=>{
    setPrompt("listening...")
    setSpeaking(true)
    setResponse(false)
  recognition.start()
      }}>Click here <CiMicrophoneOn /></button>
    :
    <div className='response'>
      {!response?
      <img src={speakimg} alt="" id="speak" />
      :
      <img src={aigif} alt="" id="aigif" />} 
      <div className="prompt-container">
        <p className="prompt-text">{prompt}</p>
      </div>
    </div>       
   }
          
    </div>
  )
}

export default App
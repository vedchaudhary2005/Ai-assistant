import React, { createContext, useState } from 'react'
import run from '../gemini';

export const datacontext = createContext()

function UserContext({children}) {
    let [speaking, setSpeaking] = useState(false)
    let [prompt, setPrompt] = useState("listening...")
    let [response, setResponse] = useState(false)
     
    function speak(text) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        let text_speak = new SpeechSynthesisUtterance(text)
        text_speak.volume = 1;
        text_speak.rate = 1;
        text_speak.pitch = 1;
        
        // Auto-detect language and set appropriate voice for cross-platform compatibility
        if (/[\u0900-\u097F]/.test(text)) {
            // Hindi text detected
            text_speak.lang = "hi-IN";
        } else {
            // English text
            text_speak.lang = "en-US";
        }
        
        // Cross-platform voice selection
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const preferredVoice = voices.find(voice => 
                voice.lang.startsWith(text_speak.lang.substring(0, 2))
            );
            if (preferredVoice) {
                text_speak.voice = preferredVoice;
            }
        }
        
        window.speechSynthesis.speak(text_speak);    
    }

    async function aiResponse(prompt) {    
        try {
            setSpeaking(true); // Set speaking to true when AI starts responding
            setResponse(false); // Reset response state
            
            let text = await run(prompt)
            
            // Fixed the text processing logic
            let newText = text
                .split("**").join("") // Remove ** formatting
                .split("*").join("") // Remove * formatting
                .replace(/google/gi, "Ved Chaudhary") // Case insensitive replace
            
            setPrompt(newText)
            speak(newText)
            setResponse(true)
            
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        } catch (error) {
            console.error("Error in AI response:", error);
            setPrompt("Sorry, I encountered an error. Please try again.")
            speak("Sorry, I encountered an error. Please try again.")
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 3000)
        }
    }

    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    let recognition = new speechRecognition()
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Universal language for cross-platform compatibility
    
    recognition.onresult = (e) => {
        let currentIndex = e.resultIndex
        let transcript = e.results[currentIndex][0].transcript
        setPrompt(transcript)
        takeCommand(transcript.toLowerCase())
    }

    recognition.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setPrompt("Speech recognition error. Please try again.")
        setTimeout(() => {
            setSpeaking(false)
        }, 3000)
    }

    function takeCommand(command) {        
        setSpeaking(true); // Set speaking to true when processing command
        
        if (command.includes("open") && command.includes("youtube")) {
            window.open("https://www.youtube.com/", "_blank")
            speak("opening Youtube")
            setResponse(true)
            setPrompt("opening Youtube...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
              
        } else if (command.includes("open") && command.includes("google")) {
            window.open("https://www.google.com/", "_blank")
            speak("opening google")
            setResponse(true)
            setPrompt("opening google...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
           
        } else if (command.includes("open") && command.includes("instagram")) {
            window.open("https://www.instagram.com/", "_blank")
            speak("opening instagram")
            setResponse(true)
            setPrompt("opening instagram...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
           
        } else if (command.includes("open") && command.includes("whatsapp")) {
            window.open("https://web.whatsapp.com/", "_blank")
            speak("opening WhatsApp")
            setResponse(true)
            setPrompt("opening WhatsApp...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
           
        } else if (command.includes("open") && command.includes("linkedin")) {
            window.open("https://www.linkedin.com/", "_blank")
            speak("opening LinkedIn")
            setResponse(true)
            setPrompt("opening LinkedIn...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
           
        } else if (command.includes("open") && command.includes("twitter")) {
            window.open("https://twitter.com/", "_blank")
            speak("opening Twitter")
            setResponse(true)
            setPrompt("opening Twitter...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
           
        } else if (command.includes("open") && command.includes("chatgpt")) {
            window.open("https://chat.openai.com/", "_blank")
            speak("opening ChatGPT")
            setResponse(true)
            setPrompt("opening ChatGPT...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
           
        } else if (command.includes("open") && command.includes("chrome")) {
            window.open("https://www.google.com/chrome/", "_blank")
            speak("opening Chrome")
            setResponse(true)
            setPrompt("opening Chrome...")
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
                            
        } else if (command.includes("time")) {
            let time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"})
            speak(time)
            setResponse(true)
            setPrompt(time)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
            
        } else if (command.includes("date")) {
            let date = new Date().toLocaleString(undefined, {day: "numeric", month: "short"})
            speak(date)
            setResponse(true)
            setPrompt(date)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        } else {
            aiResponse(command)
        }
    }

    let value = {
        recognition,
        speaking,
        setSpeaking,
        prompt,
        setPrompt,
        response,
        setResponse
    }
    
    return (
        <div>
            <datacontext.Provider value={value}>
                {children}
            </datacontext.Provider>
        </div>
    )
}

export default UserContext
import { useLanguage } from "@/context/Language";
import { useEffect, useState } from "react";

export function useSpeechToText(){
    const [listening, setListening] = useState(false)
    const [transcript,setTranscript] = useState("")
    const [lang1, setlang1] = useState("")
    const {language} = useLanguage()
    useEffect(() => {
        if(language === "hi"){
            setlang1("hi-IN")
        }
        else{
            setlang1("en-US")
        }
    },[language])

    useEffect(() =>{
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
            console.error("SpeechRecognition not supported in this browser.");
        }
        const recognition = new SpeechRecognition()
        recognition.lang = `${lang1}`
        recognition.continues = false;
        recognition.interimResults = false
        recognition.onstart = () => {
            setListening(true)
            setTranscript("")
        }
        recognition.onend = () => {
            setListening(false)
            setTimeout(() => setTranscript("") , 10000)
        }
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
        };

        (window as any).recognitionInstance = recognition;
    },[lang1])

    const startListening = () => {
        (window as any).recognitionInstance?.start();
    }
    
    return { listening, transcript, startListening };
}
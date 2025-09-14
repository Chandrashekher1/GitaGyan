import { useLanguage } from "@/context/Language";
import { useEffect, useState } from "react";

export function useSpeechToText(){
    const [listening, setListening] = useState(false)
    const [transcript,setTranscript] = useState("")
    const [lang, setlang] = useState("")
    const {language} = useLanguage()
    
    useEffect(() => {
        if(language === "en"){
            setlang("en-US")
        }
        else{
            setlang("hi-IN")
        }
    },[language])

    useEffect(() =>{
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
            console.error("SpeechRecognition not supported in this browser.");
        }

        const recognition = new SpeechRecognition()
        recognition.lang = lang
        recognition.continues = false
        recognition.interimResults = false
        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
        };

        (window as any).recognitionInstance = recognition;
    },[])

    const startListening = () => {
        (window as any).recognitionInstance?.start();
    }
    
    // const stopListening = () => {
    //     (window as any).recognitionInstance?.stop();
    // };

    return { listening, transcript, startListening };
}
import { useState, useEffect, useRef } from "react"
import { Send, User, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { motion, AnimatePresence } from "framer-motion"
import { TextShimmerWave } from "@/components/magicui/text-shimmer-wave"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Message {
  id: number
  text: string
  sender: "user" | "krishna"
  timestamp: Date
  loading?: boolean
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Radhe Radhe! 🙏 I am here to guide you through the timeless wisdom of Bhagavad Gita. What truth are you seeking today?",
      sender: "krishna",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const token = localStorage.getItem("token")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
  if (listening && transcript) {
    setInputMessage(transcript);
  }
}, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    alert("Browser does not support Speech Recognition")
  }


  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputMessage("")

      const tempId = Date.now() + 1
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          text: "",
          sender: "krishna",
          timestamp: new Date(),
          loading: true,
        },
      ])

      try {
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userMessage.text }),
        })

        if (!response.ok) throw new Error("Failed to fetch response from server")
        const data = await response.json()

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, text: data.context || " Krishna is silent...", loading: false }
              : msg
          )
        )
      } catch (error) {
        console.error(error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.loading
              ? { ...msg, text: "Failed to generate! Please try again.", loading: false }
              : msg
          )
        )
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-2 border-b border-border text-center backdrop-blur-lg sticky top-0 z-10 shadow-md"
      >
        <h1 className="text-2xl md:text-4xl font-extrabold text-accent">
          Chat with Krishna
        </h1>
        <p className="text-muted-foreground text-sm md:text-base italic mt-1">
          ✨ Discover divine wisdom, ask about dharma, or seek guidance from the Gita ✨
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-md px-4 py-3 rounded-xl shadow-lg ${
                  message.sender === "user"
                    ? "gradient-krishna text-primary-foreground"
                    : "bg-white/10 text-secondary-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <img src="/src/assets/krishna.png" className="w-7 h-7 rounded-full" />
                  )}
                  <span className="text-xs md:text-sm font-semibold">
                    {message.sender === "user" ? "You" : "Krishna"}
                  </span>
                </div>

                {message.loading ? (
                  <TextShimmerWave className="font-mono text-base md:text-lg">Generating...</TextShimmerWave>
                ) : (
                  <TypingAnimation
                    duration={12}
                    className="text-base md:text-base leading-relaxed font-comic"
                  >
                    {message.text}
                  </TypingAnimation>
                )}

                <span className="text-[10px] md:text-xs opacity-70 block mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="p-3 md:p-6 border-t border-border bg-muted/30 sticky bottom-0 backdrop-blur-md"
      >
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Krishna about life, dharma, or the Bhagavad Gita..."
            className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-input text-foreground 
                       placeholder:text-muted-foreground rounded-xl border border-border 
                       focus:outline-none focus:ring-2 focus:ring-primary 
                       transition-all font-medium text-sm md:text-base"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-3 md:px-6 py-2 md:py-3 gradient-krishna text-primary-foreground 
                       font-semibold rounded-xl hover:opacity-90 transition-all 
                       duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                       flex items-center gap-1 md:gap-2 text-sm md:text-base"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          <Button onClick={() => SpeechRecognition.startListening()}
            className="px-3 md:px-4 py-4 md:py-6 gradient-divine text-primary-foreground 
                       font-semibold rounded-xl hover:opacity-90 transition-all 
                       duration-300 flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

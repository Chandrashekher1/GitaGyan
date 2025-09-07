import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token") 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ query: userMessage.content }),
      });

      const json = await response.json();
      const reply = json?.context || "I apologize, but I couldn't process your request at this time.";

      const AiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, AiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const suggestions = [
    "What is dharma in daily life?",
    "How to find inner peace?",
    "What is the purpose of life?",
    "How to overcome fear and anxiety?",
    "What does Krishna teach about duty?",
    "How to practice detachment?"
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex-shrink-0 h-16 bg-white/90 backdrop-blur-sm border-b border-orange-200/60 shadow-sm z-10">
        <Header />
      </header>

      <div className="flex-shrink-0 ">
        <div className="container mx-auto max-w-5xl px-6 py-5 border-border/70 border-b">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-red-400 to-orange-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-white p-2">
                  <img
                    src="https://www.freevector.com/uploads/vector/preview/2916/FreeVector-Lotus-Icon.jpg"
                    alt="Sacred Lotus"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-sm animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground wave-text">
                Sacred Dialogue
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Sparkles size={16} className="text-orange-500" />
                Ancient wisdom for modern questions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-5xl h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-96">
                <div className=" text-center">

                  <div className="space-y-3">
                    <h2 className="font-display text-lg font-bold text-muted-foreground mb-2 ">
                      Welcome to Sacred Dialogue
                    </h2>
                    <p className="text-muted-foreground text-md  leading-relaxed">
                      Discover timeless wisdom from the Bhagavad Gita. Ask any question about life, 
                      purpose, relationships, or spiritual growth, and receive guidance rooted in 
                      ancient teachings.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <p className="text-sm text-muted-foreground font-bold  uppercase tracking-wide my-8">
                      Try asking about
                    </p>
                    <div className="flex ">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="group px-5 flex flex-wrap mx-1 bg-accent text-accent-foreground  hover:bg-white border border-orange-200 hover:border-orange-300 rounded-full  hover:text-orange-800 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm font-medium"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles size={14} className="group-hover:rotate-12 transition-transform duration-300" />
                            {suggestion}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex items-start gap-4 ${
                  msg.isUser ? "flex-row-reverse" : "flex-row"
                } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  {msg.isUser ? (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg ring-3 ring-orange-200">
                      <User size={20} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-200 to-red-200 border-2 border-orange-300 flex items-center justify-center shadow-md">
                      <img
                        src="https://www.freevector.com/uploads/vector/preview/2916/FreeVector-Lotus-Icon.jpg"
                        alt="Sacred Wisdom"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className={`flex flex-col max-w-[80%] ${msg.isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-md relative leading-relaxed ${
                      msg.isUser
                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-tr-md shadow-orange-200"
                        : "bg-white border border-orange-100 text-gray-800 rounded-tl-md shadow-gray-100 hover:shadow-lg transition-shadow duration-300"
                    }`}
                  >
                    <div className={`text-base ${msg.isUser ? "font-medium" : "font-normal"} whitespace-pre-line`}>
                      {msg.content}
                    </div>
                    
                    <div className={`absolute top-4 ${
                      msg.isUser 
                        ? "-right-2 w-0 h-0 border-l-8 border-l-red-600 border-t-4 border-t-transparent border-b-4 border-b-transparent" 
                        : "-left-2 w-0 h-0 border-r-8 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"
                    }`}></div>
                  </div>
                  
                  <span className={`text-xs text-gray-500 mt-2 px-3 ${msg.isUser ? "text-right" : "text-left"}`}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-200 to-red-200 border-2 border-orange-300 flex items-center justify-center shadow-md">
                  <img
                    src="https://www.freevector.com/uploads/vector/preview/2916/FreeVector-Lotus-Icon.jpg"
                    alt="Sacred Wisdom"
                    className="w-7 h-7 rounded-full object-cover animate-pulse"
                  />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 shadow-md border border-orange-100">
                  <div className="flex items-center space-x-1">
                    {/* <TextShimmerWave className="text-orange-600 font-medium">
                    
                    </TextShimmerWave> */}
                    <div className="flex space-x-1 ml-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <footer className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-orange-200/60 shadow-lg">
        <div className="container mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask for wisdom and guidance from the Bhagavad Gita..."
                className="w-full px-6 py-4 pr-14 rounded-full text-base border-2 border-orange-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 bg-white/90 backdrop-blur-sm placeholder:text-gray-500 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                disabled={isTyping}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <Sparkles size={20} className={isTyping ? "animate-spin" : ""} />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"
            >
              <Send size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
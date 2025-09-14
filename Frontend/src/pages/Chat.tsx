import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/Language";
import { useSpeechToText } from "@/Hooks/useSpeechToText";
import { Backend_Url, Lotus_Image } from "@/utils/constant";
import { Send, User, Sparkles, MicIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  language : string;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") 
  const {language} = useLanguage()
  const { listening, transcript, startListening } = useSpeechToText();

  // const {
  //     transcript,
  //     listening,
  //     browserSupportsSpeechRecognition
  //   } = useSpeechRecognition();

  //   if (!browserSupportsSpeechRecognition) {
  //       alert("Browser doesn't support speech recognition.");
  //   }
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
  if (transcript) {
    setInputValue(transcript);
  }
}, [transcript]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      language: language,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${Backend_Url}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ query: userMessage.content , language: language}),
      });

      const json = await response.json();
      const reply = json?.context || "I couldn't process your request at this time.";

      const AiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        isUser: false,
        language: language,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, AiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Experiencing technical difficulties. Please try again in a moment.",
          isUser: false,
          language:language,
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

  // const handleSuggestionClick = (suggestion: string) => {
  //   setInputValue(suggestion);
  // };

  // const suggestions = [
  //   "What is dharma in daily life?",
  //   "How to find inner peace?",
  //   "What is the purpose of life?",
  //   "How to overcome fear and anxiety?",
  //   "What does Krishna teach about duty?",
  //   "How to practice detachment?"
  // ];

  useEffect(() => {
  if (!token) {
    navigate("/login");
  }
}, [token, navigate]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex-shrink-0 h-16 bg-white/90 backdrop-blur-sm border-b border-orange-200/60 shadow-sm z-10">
        <Header />
      </header>

      <div className="flex-shrink-0 ">
        <div className="container mx-auto max-w-5xl md:px-6 px-2 md:py-5 py-2 border-border border-b">
          <div className="flex items-center md:gap-4 gap-2">
            <div className="relative group">
              <div className="md:w-14 md:h-14 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 via-red-400 to-orange-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-white p-2">
                  <img
                    src={`${Lotus_Image}`}
                    alt="Sacred Lotus"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 md:w-5 md:h-5 w-3 h-3 bg-green-500 rounded-full border-3 border-white shadow-sm animate-pulse"></div>
            </div>
            <div>
              <h1 className="md:text-3xl text-xl font-bold font-display text-primary wave-text mx-1">
                {language === 'en' ? "Sacred Dialogue" : "पवित्र संवाद"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Sparkles size={16} className="text-orange-500" />
                {language === 'en' ? "Ancient wisdom for modern questions" : "प्राचीन ज्ञान आधुनिक प्रश्नों के लिए"}
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
                    <h2 className="font-display text-xl font-bold text-primary mb-2 ">
                      {language === 'en' ? "Welcome to Sacred Dialogue 🙏" : "पवित्र संवाद में आपका स्वागत है 🙏"}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-lg  leading-relaxed">
                      {language === 'en' ? "Discover timeless wisdom from the Bhagavad Gita. Ask any question about life, purpose, relationships, or spiritual growth, and receive guidance rooted in ancient teachings." : 
                      "भगवद्गीता से शाश्वत ज्ञान की खोज करें। जीवन, उद्देश्य, संबंधों या आध्यात्मिक विकास से जुड़े किसी भी प्रश्न को पूछें और प्राचीन शिक्षाओं में निहित मार्गदर्शन प्राप्त करें।" }
                    </p>
                  </div>

                  {/* <div className="space-y-8">
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
                  </div> */}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 md:gap-4 ${
                  msg.isUser ? "flex-row-reverse" : "flex-row"
                } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  {msg.isUser ? (
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg ring-3 ring-orange-200">
                      <User  className="text-white" />
                    </div>
                  ) : (
                    <div className="md:w-11 md:h-11 w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 to-red-200 border-2 border-orange-300 flex items-center justify-center shadow-md">
                      <img
                        src={`${Lotus_Image}`}
                        alt="Sacred Wisdom"
                        className="md:w-7 md:h-7 w-5 h-5 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className={`flex flex-col max-w-[80%] ${msg.isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`md:rounded-2xl rounded-xl md:px-5 md:py-4 p-2 shadow-md relative leading-relaxed ${
                      msg.isUser
                        ? "bg-primary "
                        : "bg-card hover:shadow-primary border border-border md:font-semibold md:text-muted-foreground text-md rounded-tl-md shadow-gray-100 hover:shadow-md transition-shadow duration-300"
                    }`}
                  >
                    <div
                      className={`text-base  ${msg.isUser ? "font-medium text-primary-foreground" : "prose prose-lg max-w-none"}`}
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                    {/* <div className={`text-base  ${msg.isUser ? "font-medium text-primary-foreground" : "font-semibold text-muted-foreground text-md "}`}>
                      {msg.content}
                    </div> */}
                    
                  </div>
                  
                  <span className={`text-xs text-muted-foreground mt-2 px-3 ${msg.isUser ? "text-right" : "text-left"}`}>
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
                    src={`${Lotus_Image}`}
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
          <div className="flex items-end md:gap-4 gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue || transcript}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={language === 'en' ? "Ask for wisdom and guidance from the Bhagavad Gita..." : "भगवद्गीता से ज्ञान और मार्गदर्शन प्राप्त करें..."}
                className="w-full md:px-6 md:py-6 py-4 pr-12 rounded-full text-base md:font-semibold border-2 border-orange-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 bg-white/90 backdrop-blur-sm placeholder:text-gray-500 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                disabled={isTyping}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <Sparkles size={20} className={isTyping ? "animate-spin" : ""} />
              </div>
            </div>
            <Button onClick={startListening} disabled={listening} className="md:h-12 h-8 md:w-12 w-8 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"><MicIcon/></Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="md:h-12 h-8 md:w-12 w-8 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"
            >
              <Send size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
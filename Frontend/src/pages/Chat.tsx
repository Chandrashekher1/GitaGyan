import { useState, useEffect, useRef } from "react";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { BookOpen, Heart, MessageCircle, Send, User, Mic } from "lucide-react";
import { FlipText } from "@/components/magicui/flip-text";
import { Highlighter } from "@/components/magicui/highlighter";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/magicui/typing-animation";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'krishna';
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hare Krishna! 🙏 I am here to guide you through the wisdom of Bhagavad Gita. What would you like to know?",
      sender: 'krishna',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate Krishna's response
      setTimeout(() => {
        const krishnaResponse: Message = {
          id: Date.now(),
          text: "That's a thoughtful question. Let me share some wisdom from the Bhagavad Gita that might help you...",
          sender: 'krishna',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, krishnaResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-background">
      <div className="flex h-full">
        <div className="w-1/2 relative flex items-center justify-center bg-gradient-spiritual">
          <div className="relative h-[500px] w-[500px] flex items-center justify-center">
            
            <div className="relative z-20">
              <div className="absolute inset-0 gradient-krishna rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <img
                src="https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/08/arjun-krishna-during-mahabharata-4.jpg?size=*:900"
                alt="Krishna Avatar"
                className="relative w-64 h-64 rounded-full object-cover shadow-krishna-gold border-4 border-primary/30"
              />
            </div>

            <OrbitingCircles radius={180} className="absolute inset-0">
              <div className="bg-card/20 backdrop-blur-md rounded-full p-3 hover:bg-card/30 transition hover:scale-110 border border-border cursor-pointer">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="bg-card/20 backdrop-blur-md rounded-full p-3 hover:bg-card/30 transition hover:scale-110 border border-border cursor-pointer">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <div className="bg-card/20 backdrop-blur-md rounded-full p-3 hover:bg-card/30 transition hover:scale-110 border border-border cursor-pointer">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
            </OrbitingCircles>
          </div>
          
          <div className="absolute bottom-10 text-center">
            <h2 className="text-4xl font-bold text-card-foreground mb-2">
              <span className="text-primary">Lord</span>{" "}
              <Highlighter color="oklch(0.65 0.15 65)" action="highlight">Krishna</Highlighter>
            </h2>
            <FlipText className="text-card-foreground/80 font-bold">Divine Guide And Teacher</FlipText>
          </div>
        </div>

        <div className="w-1/2 bg-card backdrop-blur-md border-l border-border flex flex-col">
          <div className="p-2 px-4 border-b border-border">
            <h1 className="text-3xl font-bold text-primary">Chat with Gita</h1>
            <p className="text-muted-foreground">Ask questions about life, dharma, and the Bhagavad Gita</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl shadow-lg ${
                    message.sender === 'user'
                      ? 'gradient-krishna text-primary-foreground'
                      : 'bg-white/10 text-secondary-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <img src="/src/pages/krishna.png" className="w-6 h-6 bg-primary rounded-full"></img>
                    )}
                    <span className="text-sm font-medium">
                      {message.sender === 'user' ? 'You' : 'Krishna'}
                    </span>
                  </div>
                  <TypingAnimation duration={10} className="text-sm leading-relaxed">
                    {message.text}
                  </TypingAnimation>
                  <span className="text-xs opacity-70 block mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Krishna about life, dharma, or the Bhagavad Gita..."
                className="flex-1 px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-semibold "
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-6 py-3 gradient-krishna text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <Button
                className="px-4 py-6 gradient-divine text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Features } from "@/components/Features";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Quote } from "@/components/Quote";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className="min-h-screen bg-gradient-peaceful relative overflow-hidden">
            <div className="flex items-center justify-center pt-20 py-4 animate-peaceful-float animate-delay-50000 ">
                <img src="https://www.freevector.com/uploads/vector/preview/2916/FreeVector-Lotus-Icon.jpg" alt="logo" className="w-28 h-28 rounded-full object-cover shadow-lg shadow-primary " />
            </div>
            <div className="flex flex-col items-center justfify-center text-center mx-80">
                <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in ">Find Wisdom in 
                    <span className="wisdom-text block animate-pulse">Sacred Dialogue</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in delay-200 font-semibold">
                    Connect with the timeless teachings of the Bhagavad Gita through AI-powered conversations.
                    Discover insights, save meaningful responses, and embark on your spiritual journey.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <InteractiveHoverButton className="text-lg px-8 py-6 shadow-primary hover:shadow-lg transition-all duration-300 animate-wisdom-glow" >
                    <Link to="/chat" className="flex items-center">
                        <MessageCircle className="mr-2" size={20} />
                        Start Sacred Chat
                    </Link>
                </InteractiveHoverButton>
            
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 glass-effect hover:shadow-elevated transition-all duration-300" asChild>
                <Link to="">
                    Create Account
                </Link>
                </Button>
            </div>
            <div>
                <Features/>
            </div>
            <div>
                <Quote/>
            </div>
            <div className="container mx-auto px-4 py-20 text-center relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl text-foreground mb-6 font-bold wisdom-text">
                        Begin Your Journey Today
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands seeking wisdom and clarity through sacred dialogue
                    </p>
                    <InteractiveHoverButton className="text-lg px-8 py-6 shadow-divine hover:shadow-sacred transition-all duration-300 animate-wisdom-glow" >
                        <Link to="/chat">
                        Enter the Sacred Space
                        </Link>
                    </InteractiveHoverButton>
                </div>
            </div>
        </div>
    )
}
import { Features } from "@/components/Features";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Quote } from "@/components/Quote";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react"
import { Lotus_Image } from "@/utils/constant";
import { TypingAnimation } from "@/components/magicui/typing-animation";

export function Home() {
    const fadeInUp = {
      hidden: {opacity:0, y:50},
      visible: {opacity:1, y:0, transition:{duration: 0.9,ease: 'easeInOut' as const}}
    }
    
    return (
        <div className="min-h-screen bg-[var(--color-background)] relative overflow-hidden">
            <motion.div 
                initial={{ opacity: 0 }}
            className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <div className="absolute bottom-40 left-20 w-1 h-1 bg-secondary rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary rounded-full animate-ping animation-delay-1000"></div>
                <div className="absolute top-60 left-1/2 w-1 h-1 bg-accent rounded-full animate-pulse animation-delay-2000"></div>
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-primary/20 rounded-full animate-peaceful-float`}
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${20 + i * 10}%`,
                            animationDelay: `${i * 800}ms`,
                            animationDuration: `${4000 + i * 1000}ms`
                        }}
                    >
                        <Sparkles className="w-full h-full opacity-60" />
                    </div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div style={{ originX: 0.5, originY: 0.5 }}>
                     <div className="flex items-center justify-center pt-20 pb-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-sacred rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-sacred-pulse"></div>
                        <img 
                            src={`${Lotus_Image}`}
                            alt="Sacred Lotus Logo" 
                            className="relative w-32 h-32 rounded-full object-cover shadow-divine hover:shadow-sacred transition-all duration-500 animate-lotus-bloom hover:scale-110 border-4 border-primary/20 group-hover:border-primary/50" 
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/80 rounded-full flex items-center justify-center animate-bounce">
                            <Star className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto text-center mb-16">
                    <div className="relative">
                        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 leading-tight">
                            <span className="inline-block animate-fade-in hover:animate-enlighten-glow transition-all duration-300 cursor-default">
                                Find Wisdom in
                            </span>
                            <br />
                            <TypingAnimation className="wisdom-text text-primary block animate-bounce-in animation-delay-500 hover:scale-105 transition-transform duration-300 cursor-default relative text-8xl">
                                
                                    Sacred Dialogue
                                    {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-sacred rounded-full animate-divine-shimmer"></div> */}
                                
                            </TypingAnimation>
                        </h1>
                        
                        <div className="absolute -top-8 left-1/4 opacity-60 animate-peaceful-float animation-delay-1000">
                            <Heart className="w-8 h-8 text-primary/60" />
                        </div>
                        <div className="absolute top-1/2 -right-8 opacity-60 animate-peaceful-float animation-delay-2000">
                            <Sparkles className="w-6 h-6 text-accent/60" />
                        </div>
                    </div>

                    <p className="text-xl md:text-3xl text-muted-foreground mb-12 leading-relaxed animate-slide-in-right animation-delay-800 max-w-4xl mx-auto hover:text-foreground transition-colors duration-500">
                        <span className="inline-block hover:wisdom-text transition-all duration-300 cursor-default">
                            Connect with the timeless teachings of the Bhagavad Gita
                        </span>
                        <br />
                        <span className="inline-block hover:sacred-text transition-all duration-300 cursor-default animation-delay-1000 animate-fade-in">
                            through AI-powered conversations. Discover insights, save meaningful responses,
                        </span>
                        <br />
                        <span className="inline-block hover:divine-text transition-all duration-300 cursor-default animation-delay-1200 animate-fade-in font-medium">
                            and embark on your spiritual journey.
                        </span>
                    </p>
                </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in animation-delay-1400">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-sacred rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-wisdom-glow"></div>
                        <InteractiveHoverButton 
                            className="relative text-xl md:px-12 md:py-8 px-6 py-4 shadow-divine hover:shadow-sacred transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 font-semibold border-2 border-primary/20 hover:border-primary/50"
                        >
                            <Link to="/chat" className="flex items-center group">
                                <MessageCircle className="mr-3" size={24} />
                                <span className="group-hover:animate-pulse">Start Sacred Chat</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
                            </Link>
                        </InteractiveHoverButton>
                    </div>
                    
                    <div className="relative group">
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="text-xl px-12 py-8 glass-effect hover:shadow-elevated transition-all duration-500 bg-white/90 hover:bg-secondary hover:rounded-3xl transform hover:scale-105 hover:-translate-y-1 border-2 border-accent/30 hover:border-accent/60 font-semibold group relative overflow-hidden" 
                            asChild
                        >
                            <Link to="/signup" className="flex items-center relative z-10">
                                <Sparkles className="mr-2 group-hover:animate-spin" size={20} />
                                <span>Create Account</span>
                                <div className="absolute inset-0 bg-gradient-wisdom opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="animate-fade-in animation-delay-1600 transition-transform duration-700">
                    <Features />
                </div>

                <div className="animate-slide-in-right animation-delay-1800 transform hover:scale-[1.01] transition-transform duration-700">
                    <Quote />
                </div>

                <div className="py-32 text-center relative">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-sacred rounded-full blur-3xl animate-wisdom-glow"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-divine rounded-full blur-2xl animate-sacred-pulse animation-delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-wisdom rounded-full blur-3xl opacity-30 animate-peaceful-float"></div>
                    </div>

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                    className="max-w-4xl mx-auto relative z-10">
                        <div className="animate-bounce-in animation-delay-2000">
                            <h2 className="text-5xl md:text-7xl text-primary mb-8 font-bold wisdom-text hover:sacred-text transition-all duration-500 cursor-default leading-tight">
                                <span className="inline-block hover:animate-enlighten-glow">Begin Your</span>
                                <br />
                                <span className="inline-block hover:animate-sacred-pulse">Journey Today</span>
                            </h2>
                        </div>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-in animation-delay-2200 hover:text-foreground transition-colors duration-500 leading-relaxed">
                            <span className="inline-block hover:wisdom-text transition-all duration-300 cursor-default">
                                Join thousands seeking wisdom and clarity 
                            </span>
                            <span className="inline-block hover:sacred-text transition-all duration-300 cursor-default ml-2">
                                through sacred dialogue
                            </span>
                        </p>

                        <div className="">
                            <InteractiveHoverButton 
                            className="relative text-xl  px-6 py-4 shadow-divine hover:shadow-sacred transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 font-semibold border-2 border-primary/20 hover:border-primary/50"
                                >
                                <Link to="/chat" className="flex items-center group">
                                    <span className="group-hover:animate-pulse">Enter the Sacred Space</span>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
                                </Link>
                            </InteractiveHoverButton>
                        </div>

                        <div className="flex justify-center mt-12 space-x-8 animate-fade-in animation-delay-2600">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 bg-primary/40 rounded-full animate-peaceful-float hover:bg-primary hover:scale-150 transition-all duration-300 cursor-pointer animated-bounce-in`}
                                    style={{
                                        animationDelay: `${i * 10}ms`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
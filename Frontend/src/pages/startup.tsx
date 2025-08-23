
import { TypingAnimation } from "../components/magicui/typing-animation";
import { useState, useEffect } from "react";
import Particles from "@/components/bitsui/particles";

interface NameItem {
    id: number;
    text: string;
}

const name: NameItem[] = [
    {
        id: 1,
        text: "हरे कृष्ण 🙏"
    },
    {
        id: 2,
        text: "Hare Krishna 🙏"
    },
    
]

export function Startup() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                return (prevIndex + 1) % name.length;
            });
        }, 3000)

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            <Particles
                particleColors={['#ffd900', '#ffd900']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />
            
            <div className="absolute inset-0 flex justify-center items-center z-10">
                <TypingAnimation 
                    key={name[currentIndex]?.id} 
                    className="font-comic text-6xl text-[#ffd900] font-bold text-center"
                >
                    {name[currentIndex]?.text} 
                </TypingAnimation>
            </div>
        </div>
    )
}
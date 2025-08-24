import { Features } from "@/components/FeaturesCard";
import Footer from "@/components/Footer";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Meteors } from "@/components/magicui/meteors";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";
import { Heart, BookOpen, MessageCircle, ArrowRight } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen relative z-0">
      <Meteors />
      
      <div className="relative z-0 flex flex-col lg:flex-row items-center justify-center min-h-screen">
        <div className="text-center lg:text-left max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Converse with <SparklesText className="text-primary">Krishna</SparklesText> Anytime
          </h1>
          
          <p className="text-lg lg:text-2xl text-white/70 leading-relaxed">
            Seek timeless wisdom from the Bhagavad Gita in an interactive, modern way.
          </p>
          
          <div className="mt-4">
            <SparklesText className="">
              <InteractiveHoverButton className="bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 hover:scale-105 hover:shadow-2xl shadow-krishna-gold">
                Ask Now!
              </InteractiveHoverButton>
            </SparklesText> 
          </div>
        </div>

        <div className="relative h-[600px] w-[600px] flex items-center justify-center">
          <div className="relative z-20">
            <div className="absolute inset-0 gradient-krishna rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <img
              src="https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/08/arjun-krishna-during-mahabharata-4.jpg?size=*:900"
              alt="Krishna Avatar"
              className="relative w-80 h-80 rounded-full object-cover shadow-2xl border-4 border-primary/30"
            />
          </div>

          <OrbitingCircles radius={220} className="absolute inset-0">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-primary/30 transition hover:scale-110 border border-primary/30 cursor-pointer">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-accent/30 transition hover:scale-110 border border-accent/30 cursor-pointer">
              <Heart className="w-10 h-10 text-accent" />
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-secondary/30 transition hover:scale-110 border border-secondary/30 cursor-pointer">
              <MessageCircle className="w-10 h-10 text-secondary" />
            </div>
          </OrbitingCircles>
        </div>
      </div>

      <InView
        variants={{
          hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
        }}
        viewOptions={{ margin: '0px 0px -200px 0px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="text-center my-16 py-16">
          <h1 className="text-6xl font-bold my-4 text-primary">Bhagavad Gita</h1>
          
          <p className="text-xl text-white/50">
            Timeless wisdom from ancient Sanskrit scripture, guiding humanity towards righteousness, purpose, and enlightenment.
          </p>
          
          <div className="my-8">
            <Button className="mx-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
              Start Reading {<ArrowRight/>}
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg">
              Learn More
            </Button>
          </div>

          <div className="flex justify-center items-center">
            <div>
              <NumberTicker
                value={18}
                className="whitespace-pre-wrap text-6xl font-medium tracking-tighter text-primary border border-primary/30 rounded-md px-16 dark:bg-black shadow-lg shadow-primary/50 mx-4"
              />
              <p className="text-white/50 my-4 font-semibold">Chapters</p>
            </div>
            <div>
              <NumberTicker
                value={700}
                className="whitespace-pre-wrap text-6xl font-medium tracking-tighter text-primary border border-primary/30 rounded-md px-16 dark:bg-black shadow-lg shadow-primary/50 mx-4"
              />
              <p className="text-white/50 my-4 font-semibold">Verses</p>
            </div>
            <div>
              <NumberTicker
                value={35} 
                className="whitespace-pre-wrap text-6xl font-medium tracking-tighter text-primary border border-primary/30 rounded-md px-16 dark:bg-black shadow-lg shadow-primary/50 mx-4"
              />
              <p className="text-white/50 my-4 font-semibold">Readers</p>
            </div>
          </div>
        </div>
      </InView>
      
      <div className="py-16">
        <Features/>
      </div>
      
      <div className="px-16">
        <Testimonials/>
      </div>
      <Footer/>
    </div>
  );
}
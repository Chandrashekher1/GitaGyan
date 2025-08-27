import { Features } from "@/components/FeaturesCard";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Meteors } from "@/components/magicui/meteors";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";
import { ArrowRight, File, Settings, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen relative z-0 overflow-hidden">
      <Meteors />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-0 flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen px-6 md:px-12 lg:px-20"
      >
        <div className="text-center lg:text-left max-w-2xl mt-10 lg:mt-0">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Converse with{" "}
            <SparklesText className="text-primary">Krishna</SparklesText> Anytime
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed"
          >
            Seek timeless wisdom from the Bhagavad Gita in an interactive, modern way.
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex justify-center lg:justify-start"
          >
            <InteractiveHoverButton className="bg-primary text-primary-foreground font-bold text-lg sm:text-xl px-6 sm:px-10 py-3 hover:bg-primary/90 hover:scale-105 hover:shadow-2xl shadow-krishna-gold" onClick={() => navigate('/chat')}>
              Ask to Gita
            </InteractiveHoverButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="relative h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] md:h-[480px] md:w-[480px] lg:h-[600px] lg:w-[600px] flex items-center justify-center"
        >
          <motion.img
            src="https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/08/arjun-krishna-during-mahabharata-4.jpg?size=*:900"
            alt="Krishna Avatar"
            className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover shadow-2xl border-4 border-primary/30 z-20"
            whileHover={{ scale: 1.05 }}
          />

          <OrbitingCircles radius={220}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2907/2907253.png"
              alt="Book"
              className="w-12 h-12 rounded-full shadow-lg bg-white p-2"
            />
            <Settings className="w-10 h-10 text-primary" />
            <File className="w-10 h-10 text-secondary" />
            <Search className="w-10 h-10 text-accent" />
          </OrbitingCircles>

          <OrbitingCircles radius={120} reverse>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
              alt="Heart"
              className="w-10 h-10 rounded-full shadow-lg bg-white p-2"
            />
            <File className="w-8 h-8 text-primary" />
            <Search className="w-8 h-8 text-secondary" />
            <Settings className="w-8 h-8 text-accent" />
          </OrbitingCircles>
        </motion.div>
      </motion.div>

      <InView
        variants={{
          hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center my-12 sm:my-16 py-12 sm:py-16 px-6"
        >
          <motion.h1
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.2 }}
            
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-4 text-primary"
          >
            Bhagavad Gita
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/50 max-w-3xl mx-auto"
          >
            Timeless wisdom from ancient Sanskrit scripture, guiding humanity towards righteousness, purpose, and enlightenment.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
            transition={{ delay: 0.6 }}
            className="my-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8">
              Start Reading <ArrowRight className="ml-2" />
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base sm:text-lg px-6 sm:px-8">
              Learn More
            </Button>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16"
          >
            <div>
              <NumberTicker
                value={18}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-primary border border-primary/30 rounded-md px-10 sm:px-16 dark:bg-black shadow-lg shadow-primary/50"
              />
              <p className="text-white/50 my-4 font-semibold">Chapters</p>
            </div>
            <div>
              <NumberTicker
                value={700}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-primary border border-primary/30 rounded-md px-10 sm:px-16 dark:bg-black shadow-lg shadow-primary/50"
              />
              <p className="text-white/50 my-4 font-semibold">Verses</p>
            </div>
            <div>
              <NumberTicker
                value={35}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-primary border border-primary/30 rounded-md px-10 sm:px-16 dark:bg-black shadow-lg shadow-primary/50"
              />
              <p className="text-white/50 my-4 font-semibold">Readers</p>
            </div>
          </motion.div>
        </motion.div>
      </InView>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16"
      >
        <Features />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="px-4 sm:px-8 lg:px-16"
      >
        <Testimonials />
      </motion.div>
        <Footer/>
    </div>
  );
}

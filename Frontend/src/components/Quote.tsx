import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";

export function Quote() {
    const fadeInUp = {
      hidden: {opacity:0, y:500},
      visible: {opacity:1, y:-100, transition:{duration: 2,ease: 'easeInOut' as const}}
    }
    return (
        <motion.div
            variants={fadeInUp}
              initial = "hidden"
              whileInView="visible"
        className="mx-auto px-4 py-20 relative z-10">
            <Card className="max-w-4xl mx-auto bg-gradient-wisdom/20 glass-effect border-border/30 shadow-divine backdrop-blur-md">
                <CardContent className="px-12 py-4 text-center relative">
                    <div className="absolute inset-0 bg-gradient-divine opacity-5 rounded-lg " />
                        <div className="flex justify-center mb-6 relative z-10">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Om-hindu_symbol.jpg" alt="" className="w-20 h-20 rounded-full object-cover hover:scale-105"  />
                        </div>
                        <p className="font-display text-2xl md:text-3xl font-medium text-foreground mb-6 leading-relaxed relative z-10 wisdom-text">
                            "You have the right to perform your actions, but you are not entitled to the fruits of your actions."
                        </p>
                        <h1 className="text-lg text-muted-foreground relative z-10">
                            — Bhagavad Gita, Chapter 2, Verse 47
                        </h1>
                </CardContent>
            </Card>
      </motion.div>
    )
}
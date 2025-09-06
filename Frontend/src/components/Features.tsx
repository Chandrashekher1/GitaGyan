import { BookOpen, Heart, MessageCircle, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

export function Features() {
    const fadeInUp = {
      hidden: {opacity:0, y:500},
      visible: {opacity:1, y:-100, transition:{duration: 2,ease: 'easeInOut' as const}}
    }
    const features = [
        {
        icon: MessageCircle,
        title: "Sacred Conversations",
        description: "Engage in meaningful dialogue with timeless wisdom from the Bhagavad Gita"
        },
        {
        icon: Heart,
        title: "Save Insights",
        description: "Preserve the most profound responses in your personal collection of wisdom"
        },
        {
        icon: BookOpen,
        title: "Spiritual Guidance",
        description: "Find answers to life's questions through ancient teachings and modern clarity"
        },
        {
        icon: Users,
        title: "Personal Journey",
        description: "Track your spiritual growth with personalized insights and reflection tools"
        }
    ];

    return (
        <motion.div 
            variants={fadeInUp}
              initial = "hidden"
              whileInView="visible"
            //   viewport={{once:true}}
        className="mx-16 px-4 py-40 relative z-10">
            <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 wisdom-text">
                    Your Digital Sanctuary
                </h2>
                <p className="text-lg text-muted-foreground font-semibold">
                    Experience the profound wisdom of ancient texts through modern technology
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="group hover:shadow-primary shadow-xl transition-all duration-500 border-border/50 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="px-8  text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 mb-4 group-hover:animate-sacred-pulse">
                                <feature.icon className="text-primary group-hover:scale-110 transition-transform duration-300" size={24} />
                            </div>
                            <h3 className="font-display font-bold  text-xl text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
      </motion.div>
    )
}
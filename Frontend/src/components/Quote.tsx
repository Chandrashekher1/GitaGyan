import { OmegaIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function Quote() {
    return (
        <div className="mx-auto px-4 py-20 relative z-10">
            <Card className="max-w-4xl mx-auto bg-gradient-wisdom/20 glass-effect border-border/30 shadow-divine backdrop-blur-md">
                <CardContent className="px-12 py-4 text-center relative">
                    <div className="absolute inset-0 bg-gradient-divine opacity-5 rounded-lg" />
                        <OmegaIcon className="mx-auto mb-6 animate-peaceful-float text-accent drop-shadow-lg relative z-10" size={48} />
                        <p className="font-display text-2xl md:text-3xl font-medium text-foreground mb-6 leading-relaxed relative z-10 wisdom-text">
                            "You have the right to perform your actions, but you are not entitled to the fruits of your actions."
                        </p>
                        <h1 className="text-lg text-muted-foreground relative z-10">
                            — Bhagavad Gita, Chapter 2, Verse 47
                        </h1>
                </CardContent>
            </Card>
      </div>
    )
}
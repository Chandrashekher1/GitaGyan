import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    // link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card icon={item.icon}>
            <CardTitle className="text-2xl">{item.title}</CardTitle>
            <CardDescription className="text-xl">{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  icon,
}: {
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // Updated with spiritual colors and gradients
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-md border border-border/50 group-hover:border-primary/60 group-hover:shadow-2xl group-hover:shadow-primary/25 relative z-20 transition-all duration-300 group-hover:scale-[1.02]",
        className
      )}
    >
      <div className="relative z-50">
        {/* Icon with divine glow */}
        {icon && (
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/30 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110">
              <div className="text-primary text-3xl group-hover:text-primary transition-all duration-300">
                {icon}
              </div>
            </div>
          </div>
        )}
        
        {/* Subtle divine glow effect */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 w-1 h-1 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"></div>
        
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 
      className={cn(
        // Updated with golden gradient text effect
        "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-bold tracking-wide mt-4 group-hover:from-primary group-hover:via-primary group-hover:to-accent transition-all duration-300",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        // Updated with better contrast and spiritual theming
        "mt-8 text-muted-foreground group-hover:text-foreground/90 tracking-wide leading-relaxed text-sm transition-colors duration-300",
        className
      )}
    >
      {children}
    </p>
  );
};

// Enhanced version with icons and spiritual elements
export const SpiritualCard = ({
  className,
  children,
  icon,
}: {
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // Premium spiritual card styling
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-lg border-2 border-primary/20 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/30 relative z-20 transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-2",
        className
      )}
    >
      {/* Divine background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute top-4 right-4 w-8 h-8 border border-primary/30 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border border-accent/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 border border-secondary/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-50">
        {/* Icon with divine glow */}
        {icon && (
          <div className="mb-4 p-3 w-fit bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25">
            <div className="text-primary group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
        )}
        
        {/* Spiritual sparkles */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-2 w-1 h-1 bg-accent/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
        <div className="absolute top-1 right-4 w-1 h-1 bg-secondary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
        
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};
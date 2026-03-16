import { useId } from "react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
}

export function BrandMark({ className, iconClassName }: BrandMarkProps) {
  const gradientId = useId().replace(/:/g, "");
  const petalGradientId = `${gradientId}-petal`;
  const glowGradientId = `${gradientId}-glow`;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[1.4rem] border border-primary/15 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.98),rgba(255,246,232,0.92)_48%,rgba(236,214,183,0.88)_100%)] shadow-[0_18px_36px_-24px_rgba(58,36,16,0.45)]",
        className
      )}
    >
      <div className="absolute inset-1 rounded-[1.15rem] border border-white/65 bg-white/35" />
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={cn("relative h-7 w-7", iconClassName)}
        fill="none"
      >
        <defs>
          <linearGradient id={petalGradientId} x1="14" y1="18" x2="50" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F4C96A" />
            <stop offset="0.55" stopColor="#E98E3A" />
            <stop offset="1" stopColor="#9A4E2C" />
          </linearGradient>
          <radialGradient
            id={glowGradientId}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(32 18) rotate(90) scale(10)"
          >
            <stop stopColor="#FFF0C9" />
            <stop offset="1" stopColor="#FFF0C9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="32" cy="18" r="10" fill={`url(#${glowGradientId})`} />
        <path
          d="M32 19.5C27.8 23.2 26.2 28 27.4 35C31 33.5 32.8 28.9 32 19.5Z"
          fill={`url(#${petalGradientId})`}
          stroke="#8F4B2C"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M29.4 24.2C23.9 25.4 20.4 29 18.8 34.9C24 35.5 28 32.5 29.4 24.2Z"
          fill={`url(#${petalGradientId})`}
          stroke="#8F4B2C"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M34.6 24.2C40.1 25.4 43.6 29 45.2 34.9C40 35.5 36 32.5 34.6 24.2Z"
          fill={`url(#${petalGradientId})`}
          stroke="#8F4B2C"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M27 34.8C21.2 34.1 16.6 36 13.6 41C19.2 42.3 23.7 40.7 27 34.8Z"
          fill={`url(#${petalGradientId})`}
          opacity="0.92"
          stroke="#8F4B2C"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M37 34.8C42.8 34.1 47.4 36 50.4 41C44.8 42.3 40.3 40.7 37 34.8Z"
          fill={`url(#${petalGradientId})`}
          opacity="0.92"
          stroke="#8F4B2C"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M18 45C22.6 43 27.3 42 32 42C36.7 42 41.4 43 46 45" stroke="#8F4B2C" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 49C25 47.5 28.3 46.8 32 46.8C35.7 46.8 39 47.5 42 49" stroke="#8F4B2C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

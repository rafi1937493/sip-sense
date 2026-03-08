"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface HydrationRingProps {
  consumed: number
  goal: number
  size?: "sm" | "md" | "lg"
}

export function HydrationRing({ consumed, goal, size = "md" }: HydrationRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const progress = Math.min((consumed / goal) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 80)
    return () => clearTimeout(timer)
  }, [progress])

  const sizes = {
    sm: { ring: 120, stroke: 10, text: "text-2xl", label: "text-xs" },
    md: { ring: 180, stroke: 14, text: "text-3xl", label: "text-sm" },
    lg: { ring: 240, stroke: 18, text: "text-4xl", label: "text-base" },
  }

  const { ring, stroke, text, label } = sizes[size]
  const radius = (ring - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  return (
    <div
      className="relative flex items-center justify-center"
      role="img"
      aria-label={`${Math.round(progress)} percent hydration progress, ${consumed} milliliters out of ${goal}`}
    >
      <svg width={ring} height={ring} className="-rotate-90 transform">
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-semibold tracking-tight", text)}>{Math.round(progress)}%</span>
        <span className={cn("text-muted-foreground", label)}>
          {consumed} / {goal} ml
        </span>
      </div>
    </div>
  )
}

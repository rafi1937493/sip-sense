import { cn } from "@/lib/utils"
import { Droplet, Clock } from "lucide-react"
import { useMemo, useEffect, useState } from "react"

interface NeumorphicHydrationWidgetProps {
  currentMl: number
  goalMl: number
  className?: string
}

export function NeumorphicHydrationWidget({ currentMl, goalMl, className }: NeumorphicHydrationWidgetProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const progress = Math.min(Math.max((currentMl / goalMl) * 100, 0), 100)
  const waterTopPercentage = 100 - progress
  
  // Create a visually pleasing layout mimicking the new reference image
  const formatLiters = (ml: number) => {
    return (ml / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + "L"
  }

  // Soft UI background colors and styling for neumorphism
  // Using an off-white/very light blue hue the reference image seems to use: #e6eef5
  
  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      <p className="mb-6 text-sm font-medium text-slate-400">You need to drink more!</p>
      
      {/* The Neumorphic Outer Ring */}
      <div className="relative mb-6 flex size-[200px] items-center justify-center rounded-full bg-[#ebf0f7] shadow-[12px_12px_24px_#c8d0e7,-12px_-12px_24px_#ffffff]">
        {/* The Inner "Glass Hole" Container */}
        <div className="relative size-[160px] overflow-hidden rounded-full shadow-[inset_8px_8px_16px_#c8d0e7,inset_-8px_-8px_16px_#ffffff]">
          
          {/* Faint measurement lines in the background */}
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 opacity-20">
             {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-[2px] w-6 rounded-full bg-slate-600" />
             ))}
          </div>

          {/* BACKGROUND WAVE ANIMATIONS */}
          <div
            className="absolute inset-0 z-10 transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateY(${mounted ? waterTopPercentage : 100}%)` }}
          >
            {/* Deep water base background */}
            <div className="absolute inset-0 top-[15px] bg-gradient-to-b from-[#2b5cbe] to-[#122c66]" />
            
            {/* Animated Waves */}
            <div className="wave-container absolute inset-0">
              {/* Back wave */}
              <div className="wave-bg absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-[93%] animate-[wave-slow_12s_linear_infinite] rounded-[43%] bg-[#3672e8]/80 mix-blend-screen" />
              {/* Front wave */}
              <div className="wave-fg absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-[90%] animate-[wave-fast_8s_linear_infinite] rounded-[40%] bg-[#1b4396]" />
            </div>
          </div>
          
          {/* Glass glare effect strictly inside the circle */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-50 mix-blend-overlay" />
        </div>

        {/* Floating Side Indicators */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-50">
           <Droplet className="size-4 fill-slate-400/50 text-slate-400" />
           <span className="text-[10px] font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-50">
           <Clock className="size-4 text-slate-400" />
           <span className="text-[10px] font-bold">10 h</span>
        </div>
      </div>

      {/* Primary Measurement Text */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-800">
          {formatLiters(currentMl)}
        </span>
        <span className="text-2xl font-bold text-slate-400">/</span>
        <span className="text-2xl font-bold text-slate-400">
          {formatLiters(goalMl)}
        </span>
      </div>
    </div>
  )
}

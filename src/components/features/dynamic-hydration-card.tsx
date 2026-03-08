import { cn } from "@/lib/utils"
import { Droplet } from "lucide-react"

interface DynamicHydrationCardProps {
  currentMl: number
  goalMl: number
  className?: string
}

export function DynamicHydrationCard({ currentMl, goalMl, className }: DynamicHydrationCardProps) {
  // Clamp progress between 0 and 100
  const progress = Math.min(Math.max((currentMl / goalMl) * 100, 0), 100)

  // Decide how many total drops to show. The reference image shows 8.
  const totalDrops = 8
  const filledDrops = Math.floor((progress / 100) * totalDrops)

  // Calculate the wave's vertical position based on progress.
  // 0% -> wave is fully at the bottom (-10% or so visible).
  // 100% -> wave covers everything.
  // Let's map 0-100% progress to top: 100% to top: 0% relative positions.
  // Actually, standard wave animations use a large absolute element that translates/rotates.
  // We'll calculate the `top` offset of the water container.
  const waterTopPercentage = 100 - progress

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[24px] bg-[#111620] p-6 text-white shadow-2xl isolate",
        className
      )}
      style={{ minHeight: "220px" }}
    >
      {/* BACKGROUND WAVE ANIMATIONS */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(${waterTopPercentage}%)` }}
      >
        {/* Deep water base background */}
        <div className="absolute inset-0 top-[15px] bg-gradient-to-b from-[#1b62dd] to-[#0d3478]" />
        
        {/* Animated Waves */}
        <div className="wave-container">
           {/* Back wave */}
          <div className="wave-bg absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-[90%] animate-[wave-slow_12s_linear_infinite] rounded-[45%] bg-[#1b62dd]/40 shadow-[0_0_30px_rgba(27,98,221,0.6)]" />
           {/* Front wave */}
          <div className="wave-fg absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-[85%] animate-[wave-fast_8s_linear_infinite] rounded-[40%] bg-[#1b62dd]/60" />
        </div>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Top Indicators Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 opacity-90">
            {Array.from({ length: totalDrops }).map((_, i) => (
              <Droplet
                key={i}
                className={cn(
                  "size-4 transition-all duration-500",
                  i < filledDrops ? "fill-[#4eaaff] text-[#4eaaff] drop-shadow-[0_0_8px_rgba(78,170,255,0.8)]" : "text-white/20"
                )}
                strokeWidth={i < filledDrops ? 0 : 2.5}
              />
            ))}
          </div>
          <p className="font-mono text-sm font-medium tracking-wider text-white/40">
            {goalMl}ml
          </p>
        </div>

        {/* Bottom Text Area */}
        <div className="mt-auto pt-16">
          <p className="mb-0.5 text-xs font-semibold tracking-widest text-white/50 uppercase">Today</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold tracking-tight md:text-6xl drop-shadow-md">
              {currentMl}
            </span>
            <span className="text-xl font-semibold text-white/80 md:text-2xl drop-shadow-md">
              ml
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

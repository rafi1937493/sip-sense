"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { DrinkType } from "@/types"

interface DrinkCardProps {
  onAddDrink: () => void
  currentMl: number
  goalMl: number
  className?: string
}

export const DRINK_EMOJIS: Record<string, string> = {
  Water: "\u{1F4A7}",
  "Lemon Water": "\u{1F34B}",
  "Coconut Water": "\u{1F965}",
  "Milk Tea (Cha)": "\u{1F9CB}",
  "Black Tea": "\u{1F375}",
  Coffee: "\u2615",
  Lassi: "\u{1F95B}",
  Borhani: "\u{1F964}",
  "Sugarcane Juice": "\u{1F379}",
  "Fresh Fruit Juice": "\u{1F9C3}",
  "Soft Drink": "\u{1F964}",
  "Energy Drink": "\u26A1",
}

export function DrinkCard({ onAddDrink, currentMl, goalMl, className }: DrinkCardProps) {
  const progress = Math.min((currentMl / goalMl) * 100, 100)

  return (
    <Card className={cn("surface-card border-primary/20 bg-card/95", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Add Drink</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-3xl font-semibold tracking-tight">{currentMl} ml</p>
            <p className="text-muted-foreground text-sm">Goal {goalMl} ml</p>
          </div>
          <Button size="icon" className="size-12 rounded-full" onClick={onAddDrink} aria-label="Add drink">
            <Plus className="size-6" />
          </Button>
        </div>
        <Progress value={progress} aria-label={`${Math.round(progress)} percent progress toward hydration goal`} />
        <p className="text-muted-foreground text-sm">Tap the plus button to log a drink quickly.</p>
      </CardContent>
    </Card>
  )
}

interface QuickDrinkButtonProps {
  type: DrinkType
  onClick: (drinkType: DrinkType) => void
}

export function QuickDrinkButton({ type, onClick }: QuickDrinkButtonProps) {
  return (
    <Button
      variant="outline"
      className="surface-card h-auto min-h-24 w-full flex-col gap-1.5 py-3 hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(type)}
      aria-label={`Add ${type}`}
    >
      <span className="text-xl">{DRINK_EMOJIS[type] || "\u{1F4A7}"}</span>
      <span className="text-muted-foreground max-w-full truncate text-[11px]">{type.split(" ")[0]}</span>
    </Button>
  )
}

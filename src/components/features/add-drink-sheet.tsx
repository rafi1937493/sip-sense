"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { DrinkType, DrinkSize } from "@/types"
import { DRINK_TYPES, DRINK_SIZES, calculateHydration } from "@/types"
import { DRINK_EMOJIS } from "./drink-card"
import { Separator } from "@/components/ui/separator"

interface AddDrinkSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddDrink: (drinkType: DrinkType, quantityMl: number) => void
}

const drinkOptions = Object.values(DRINK_TYPES)

export function AddDrinkSheet({ isOpen, onClose, onAddDrink }: AddDrinkSheetProps) {
  const [step, setStep] = useState<"select" | "size">("select")
  const [selectedDrink, setSelectedDrink] = useState<DrinkType | null>(null)

  const handleSelectDrink = (drink: DrinkType) => {
    setSelectedDrink(drink)
    setStep("size")
  }

  const handleSelectSize = (size: DrinkSize) => {
    if (!selectedDrink) return
    onAddDrink(selectedDrink, DRINK_SIZES[size].ml)
    handleClose()
  }

  const handleClose = () => {
    setStep("select")
    setSelectedDrink(null)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? handleClose() : undefined)}>
      <SheetContent side="bottom" className="mx-auto max-h-[88vh] max-w-[420px] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="px-5 pb-3 pt-5">
          <SheetTitle>{step === "select" ? "Select drink" : `Add ${selectedDrink}`}</SheetTitle>
          <SheetDescription>
            {step === "select" ? "Choose a drink type" : "Choose a serving size"}
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <div className="p-5">
          {step === "select" ? (
            <div className="grid grid-cols-3 gap-2.5">
              {drinkOptions.map((drink) => (
                <Button
                  key={drink}
                  variant="outline"
                  className="h-auto min-h-24 flex-col gap-2 py-3 hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all"
                  onClick={() => handleSelectDrink(drink)}
                >
                  <span className="text-xl">{DRINK_EMOJIS[drink] || "\u{1F4A7}"}</span>
                  <span className="text-center text-[11px] leading-tight">{drink}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm font-semibold">{selectedDrink}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Hydration factor: {calculateHydration(100, selectedDrink as DrinkType)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(Object.entries(DRINK_SIZES) as [DrinkSize, { label: string; ml: number }][]).map(([size, { label, ml }]) => {
                  const hydration = calculateHydration(ml, selectedDrink as DrinkType)
                  return (
                    <Button
                      key={size}
                      variant="outline"
                      className="h-auto min-h-24 flex-col items-start gap-0.5 py-4 hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all"
                      onClick={() => handleSelectSize(size)}
                    >
                      <span className="text-base font-semibold">{ml} ml</span>
                      <span className="text-muted-foreground text-xs">{label}</span>
                      <span className="text-primary text-xs">{hydration} ml hydration</span>
                    </Button>
                  )
                })}
              </div>

              <Button variant="ghost" className="w-full" onClick={() => setStep("select")}>
                <ArrowLeft className="mr-1 size-4" />
                Back to drinks
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

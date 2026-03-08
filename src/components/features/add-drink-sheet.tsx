"use client"

import { useState } from "react"
import { ArrowLeft, Check, ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DrinkType, DrinkSize } from "@/types"
import { DRINK_TYPES, DRINK_SIZES, calculateHydration } from "@/types"
import { DRINK_EMOJIS } from "./drink-card"
import { cn } from "@/lib/utils"

interface AddDrinkSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddDrink: (drinkType: string, quantityMl: number, factor?: number, icon?: string) => void
}

const EMOJI_OPTIONS = ["💧", "🥤", "☕", "🧋", "🧃", "🥛", "🍵", "🍺", "🍷", "🍹", "🥣"]

export function AddDrinkSheet({ isOpen, onClose, onAddDrink }: AddDrinkSheetProps) {
  const [step, setStep] = useState<"select" | "size" | "custom">("select")
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<DrinkSize | null>(null)
  
  // Custom Drink States
  const [customName, setCustomName] = useState("")
  const [customEmoji, setCustomEmoji] = useState("🥤")
  const [customFactor, setCustomFactor] = useState(100)

  // Filter out Energy Drink and prepare the regular list
  const drinksList = Object.values(DRINK_TYPES).filter(d => d !== DRINK_TYPES.ENERGY_DRINK)

  const handleSelectDrink = (drink: string) => {
    setSelectedDrink(drink)
    setStep("size")
  }

  const handleSelectSize = (size: DrinkSize) => {
    setSelectedSize(size)
  }

  const handleOpenCustom = () => {
    setStep("custom")
  }

  const handleSaveCustom = () => {
    // We allow saving even if empty by defaulting to "My Drink"
    const finalName = customName.trim() || `My Drink`
    setSelectedDrink(finalName)
    setStep("size")
  }

  const handleConfirmAdd = () => {
    if (selectedDrink && selectedSize) {
      const isCustom = !Object.values(DRINK_TYPES).includes(selectedDrink as any)
      const icon = isCustom ? customEmoji : DRINK_EMOJIS[selectedDrink]
      onAddDrink(selectedDrink, DRINK_SIZES[selectedSize].ml, isCustom ? customFactor / 100 : undefined, icon)
      handleClose()
    }
  }

  const handleClose = () => {
    setStep("select")
    setSelectedDrink(null)
    setSelectedSize(null)
    setCustomName("")
    setCustomEmoji("🥤")
    setCustomFactor(100)
    onClose()
  }

  const goBack = () => {
    if (step === "size") {
      setStep("select")
      setSelectedSize(null)
    } else if (step === "custom") {
      setStep("select")
    }
  }

  const getPreviewHydration = (ml: number) => {
    if (!selectedDrink) return 0
    const isCustom = !Object.values(DRINK_TYPES).includes(selectedDrink as any)
    if (isCustom) {
      return Math.round(ml * (customFactor / 100))
    }
    return calculateHydration(ml, selectedDrink as DrinkType)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? handleClose() : undefined)}>
      <SheetContent side="bottom" className="mx-auto max-h-[92vh] max-w-[420px] overflow-hidden p-0 border-none bg-[#f0f2f5] shadow-2xl" showCloseButton={false}>
        <div className="flex flex-col h-full bg-[#f0f2f5]">
          <div className="flex justify-center pt-3 pb-1">
             <div className="h-1.5 w-12 rounded-full bg-slate-200" />
          </div>

          <div className="px-6 pt-6 pb-6 flex flex-col gap-1 bg-white rounded-b-[2.5rem] shadow-sm">
            <SheetTitle className="text-[26px] font-[1000] text-[#0d1f3c] tracking-tight text-center leading-none">
               {step === "select" ? "Select Drink" : step === "custom" ? "Custom Drink" : "Select Size"}
            </SheetTitle>
            <SheetDescription className="text-[11px] font-[800] text-slate-400 uppercase tracking-[0.14em] text-center">
               {step === "select" ? "What are you drinking today?" : step === "custom" ? "Design your own hydration" : "How much are you having?"}
            </SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
            {step === "select" ? (
              <div className="grid grid-cols-3 gap-3.5 pb-6">
                {drinksList.map((drink) => (
                  <button
                    key={drink}
                    onClick={() => handleSelectDrink(drink)}
                    className={cn(
                      "relative flex flex-col items-center gap-2.5 p-4 rounded-[1.75rem] bg-white transition-all duration-300",
                      "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.04)] hover:border-blue-100 hover:shadow-md border-2 border-transparent"
                    )}
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-500">
                      <span className="text-2xl leading-none">{DRINK_EMOJIS[drink] || "💧"}</span>
                    </div>
                    <span className="text-[11px] font-bold text-center leading-tight text-[#374151]">
                      {drink}
                    </span>
                  </button>
                ))}
                
                <button
                  onClick={handleOpenCustom}
                  className="relative flex flex-col items-center gap-2.5 p-4 rounded-[1.75rem] bg-white border-2 border-dashed border-slate-200 transition-all duration-300 hover:bg-white/80 hover:border-blue-400 group shadow-[0_4px_12px_-2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:scale-110">
                    <Plus className="size-6 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight text-[#374151] group-hover:text-blue-600">
                    Add Your Own
                  </span>
                </button>
              </div>
            ) : step === "custom" ? (
              <div className="flex flex-col gap-6 pb-6">
                <div className="flex flex-col gap-6 p-1">
                   {/* Name Field */}
                   <div className="flex flex-col gap-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drink Name</Label>
                      <Input 
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Fresh Mango Juice"
                        className="h-14 rounded-2xl border-2 border-white bg-white px-5 text-base font-bold text-[#0d1f3c] shadow-sm focus:border-blue-500 transition-all outline-none"
                      />
                   </div>

                   {/* Emoji Selection with Blue Border */}
                   <div className="flex flex-col gap-3">
                     <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Icon Selection</Label>
                     <div className="flex flex-wrap justify-center gap-3">
                       {EMOJI_OPTIONS.map(emoji => (
                         <button
                           key={emoji}
                           onClick={() => setCustomEmoji(emoji)}
                           className={cn(
                             "flex size-12 items-center justify-center rounded-xl transition-all duration-200 border-2",
                             customEmoji === emoji ? "border-blue-600 bg-blue-50/50 shadow-md scale-110" : "border-transparent bg-white shadow-sm hover:scale-105"
                           )}
                         >
                           <span className="text-xl leading-none">{emoji}</span>
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Stylized Slider with Blue Track Fill */}
                   <div className="flex flex-col gap-4 mt-2">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between ml-1">
                           <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Hydration Ratio</Label>
                           <span className="text-[13px] font-black text-white bg-blue-600 px-3 py-1 rounded-full shadow-lg shadow-blue-100">{customFactor}%</span>
                        </div>
                        <div className="relative flex items-center h-4">
                           <input 
                              type="range"
                              min="0"
                              max="100"
                              value={customFactor}
                              onChange={(e) => setCustomFactor(parseInt(e.target.value))}
                              className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-blue-600 z-10"
                              style={{
                                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${customFactor}%, #e2e8f0 ${customFactor}%, #e2e8f0 100%)`
                              }}
                           />
                        </div>
                        <div className="flex justify-between px-1">
                           <span className="text-[12px] font-black text-slate-400 uppercase tracking-tight">Dry</span>
                           <span className="text-[12px] font-black text-[#0d1f3c] uppercase tracking-tight">Pure Water</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5 pb-4">
                <div className="flex items-center gap-4 bg-white p-5 rounded-[2.25rem] shadow-sm border border-white">
                   <div className="flex size-15 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-100 shrink-0">
                      <span className="text-3xl leading-none">
                        {Object.values(DRINK_TYPES).includes(selectedDrink as any) ? (DRINK_EMOJIS[selectedDrink!] || "💧") : customEmoji}
                      </span>
                   </div>
                   <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-lg font-[900] text-[#0d1f3c] truncate leading-tight">{selectedDrink}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                          {Object.values(DRINK_TYPES).includes(selectedDrink as any) 
                            ? calculateHydration(100, selectedDrink as DrinkType) 
                            : customFactor}% Efficiency
                        </span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {(Object.entries(DRINK_SIZES) as [DrinkSize, { label: string; ml: number }][]).map(([size, { label, ml }]) => {
                    const isSelected = selectedSize === size
                    const hydrationPreview = getPreviewHydration(ml)
                    return (
                      <button
                        key={size}
                        onClick={() => handleSelectSize(size)}
                        className={cn(
                          "relative flex items-center justify-between p-4 px-6 rounded-2xl bg-white transition-all duration-200 text-left",
                          "shadow-sm border-2",
                          isSelected 
                            ? "border-blue-600 bg-blue-50/10 shadow-blue-100/20" 
                            : "border-transparent hover:bg-slate-50"
                        )}
                      >
                        <div className="flex flex-col gap-0.5">
                           <span className={cn("text-[17px] font-[900] tracking-tight leading-none", isSelected ? "text-blue-600" : "text-[#0d1f3c]")}>
                              {ml} ml
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <span className={cn("text-[11px] font-black", isSelected ? "text-blue-500/70" : "text-slate-300")}>
                              +{hydrationPreview} ml
                           </span>
                           <div className={cn(
                             "flex size-6 items-center justify-center rounded-full transition-all duration-300 border",
                             isSelected ? "bg-blue-600 border-blue-600 shadow-md scale-100" : "bg-slate-100 border-slate-200 scale-90"
                           )}>
                              <Check className={cn("size-3.5 stroke-[4px] transition-all", isSelected ? "text-white opacity-100" : "text-slate-300 opacity-0")} />
                           </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pt-5 pb-10 flex flex-col gap-3 bg-white rounded-t-[2.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.08)] shrink-0 border-t border-slate-50">
            {step === "select" ? (
              <Button 
                variant="outline"
                className="h-14 w-full rounded-2xl border-2 border-slate-100 text-base font-[900] text-slate-400 hover:bg-slate-50 transition-all active:scale-[0.97]"
                onClick={handleClose}
              >
                Cancel
              </Button>
            ) : step === "custom" ? (
              <div className="flex flex-col gap-3">
                <Button 
                  className="h-16 w-full rounded-2xl text-[17px] font-[1000] !bg-blue-600 !text-white shadow-2xl shadow-blue-200 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                  onClick={handleSaveCustom}
                >
                  Save & Select <ArrowRight className="size-5 stroke-[3px]" />
                </Button>
                <Button 
                  variant="outline"
                  className="h-13 w-full rounded-2xl border-2 border-slate-100 text-sm font-[900] text-slate-400 hover:bg-slate-50 flex gap-2 items-center justify-center transition-all active:scale-[0.97]"
                  onClick={goBack}
                >
                  <ArrowLeft className="size-4 stroke-[4px]" />
                  Back
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button 
                  className={cn(
                    "h-16 w-full rounded-2xl text-[17px] font-[1000] transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-2xl",
                    selectedSize 
                      ? "!bg-blue-600 !text-white shadow-blue-200" 
                      : "!bg-slate-100 !text-slate-300 cursor-not-allowed"
                  )}
                  style={{ backgroundColor: selectedSize ? '#2563eb' : '#f1f5f9', color: selectedSize ? '#ffffff' : '#94a3b8' }}
                  onClick={handleConfirmAdd}
                  disabled={!selectedSize}
                >
                  Add Drink <ArrowRight className="size-5 stroke-[3px]" />
                </Button>
                <Button 
                  variant="outline"
                  className="h-13 w-full rounded-2xl border-2 border-slate-100 text-sm font-[900] text-slate-400 hover:bg-slate-50 flex gap-2 items-center justify-center transition-all active:scale-[0.97]"
                  onClick={goBack}
                >
                  <ArrowLeft className="size-4 stroke-[4px]" />
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

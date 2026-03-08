"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useHydrationStore } from "@/store"
import { cn } from "@/lib/utils"

import { Dumbbell } from "lucide-react"

interface WeightEditDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function WeightEditDrawer({ isOpen, onClose }: WeightEditDrawerProps) {
  const { user, updateUser, isLoading } = useHydrationStore()
  const [weight, setWeight] = useState(user?.weight?.toString() || "")
  const [unit, setUnit] = useState<"kg" | "lbs">(user?.weightUnit || "kg")

  useEffect(() => {
    if (isOpen && user) {
      setWeight(user.weight?.toString() || "")
      setUnit(user.weightUnit || "kg")
    }
  }, [isOpen, user])

  const handleSave = async () => {
    await updateUser({
      weight: weight ? Number(weight) : undefined,
      weightUnit: unit,
    })
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="bottom" className="mx-auto max-h-[92vh] max-w-[420px] overflow-hidden p-0 border-none bg-[#f0f2f5] shadow-2xl" showCloseButton={false}>
        <div className="flex flex-col h-full bg-[#f0f2f5]">
          {/* PREMIUM DARK HEADER */}
          <div className="bg-gradient-to-b from-[#1e293b] to-[#0d1f3c] rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
            {/* DRAG HANDLE */}
            <div className="flex justify-center pt-4 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-slate-400/30" />
            </div>

            <div className="px-6 pt-6 pb-10 flex flex-col items-center gap-2">
              <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <Dumbbell className="size-6 text-blue-300" />
              </div>
              <SheetTitle className="text-[26px] font-[1000] text-white tracking-tight text-center leading-none">
                 Edit Weight
              </SheetTitle>
              <SheetDescription className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.15em] text-center">
                 UPDATE YOUR BODY WEIGHT
              </SheetDescription>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 size-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />
          </div>

          <div className="flex-1 px-6 py-4">
            <div className="flex flex-col gap-5">
              {/* Unit Toggle */}
              <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Measurement Unit</Label>
                <div className="flex bg-[#f1f5f9] rounded-[8px] p-1 self-center w-full max-w-[240px]">
                  <button 
                    onClick={() => setUnit("kg")}
                    className={cn(
                      "flex-1 py-2 text-[11px] font-black uppercase rounded-[6px] transition-all",
                      unit === 'kg' ? "!bg-[#2563eb] !text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-600"
                    )}
                  >KG</button>
                  <button 
                    onClick={() => setUnit("lbs")}
                    className={cn(
                      "flex-1 py-2 text-[11px] font-black uppercase rounded-[6px] transition-all",
                      unit === 'lbs' ? "!bg-[#2563eb] !text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-600"
                    )}
                  >LBS</button>
                </div>
              </div>

              {/* Weight Input */}
              <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Weight</Label>
                <div className="relative">
                  <Input 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === 'kg' ? "e.g. 70" : "e.g. 155"}
                    className="h-14 rounded-2xl border-2 border-white bg-white px-6 text-xl font-black text-[#0d1f3c] shadow-sm focus:border-blue-500 transition-all outline-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[11px] font-black text-blue-500 uppercase">{unit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-8 flex flex-col gap-3 bg-white rounded-t-[2.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.08)] shrink-0 border-t border-slate-50">
            <Button 
              className="h-14 w-full rounded-2xl text-[16px] font-[1000] !bg-blue-600 !text-white shadow-2xl shadow-blue-200 transition-all active:scale-[0.97]"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline"
              className="h-12 w-full rounded-2xl border-2 border-slate-100 text-[13px] font-[900] text-slate-400 hover:bg-slate-50 transition-all active:scale-[0.97]"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { useHydrationStore } from "@/store"
import { cn } from "@/lib/utils"

import { Cake } from "lucide-react"

interface DOBEditDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const DateDropdownPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  // value is ISO string (YYYY-MM-DD)
  const date = value ? new Date(value) : null
  const day = date ? date.getDate() : ""
  const month = date ? date.getMonth() : ""
  const year = date ? date.getFullYear() : ""

  const years = Array.from({ length: 71 }, (_, i) => 1940 + i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const daysInMonth = (year && typeof month === 'number') 
    ? new Date(Number(year), month + 1, 0).getDate() 
    : 31
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleUpdate = (type: 'd' | 'm' | 'y', val: string) => {
    const newDay = type === 'd' ? Number(val) : (day || 1)
    const newMonth = type === 'm' ? Number(val) : (month === "" ? 0 : Number(month))
    const newYear = type === 'y' ? Number(val) : (year || 2000)
    
    // Create date in local time to avoid timezone shifts
    const d = new Date(newYear, newMonth, newDay)
    onChange(d.toISOString().split('T')[0])
  }

  const selectClasses = "h-14 w-full bg-white rounded-2xl border-2 border-[#e2e8f0] px-4 text-base font-bold text-[#0d1f3c] outline-none focus:border-blue-500 transition-all shadow-sm appearance-none"

  return (
    <div className="flex gap-2 mt-1 w-full items-center">
      {/* Month dropdown */}
      <div className="flex-[2] relative min-w-0">
        <select 
          value={month} 
          onChange={(e) => handleUpdate('m', e.target.value)}
          className={selectClasses}
        >
          <option value="" disabled>Month</option>
          {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Day dropdown */}
      <div className="flex-1 relative min-w-0">
        <select 
          value={day} 
          onChange={(e) => handleUpdate('d', e.target.value)}
          className={selectClasses}
        >
          <option value="" disabled>Day</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Year dropdown */}
      <div className="flex-1 relative min-w-0">
        <select 
          value={year} 
          onChange={(e) => handleUpdate('y', e.target.value)}
          className={selectClasses}
        >
          <option value="" disabled>Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

const formatDateToInput = (date: Date | string | undefined | null) => {
  if (!date) return "";
  // Check if it's a string first and parse it with new Date() as requested
  const d = typeof date === 'string' ? new Date(date) : new Date(date as any);
  if (d && typeof d.toISOString === 'function' && !isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return "";
}

export function DOBEditDrawer({ isOpen, onClose }: DOBEditDrawerProps) {
  const { user, updateUser, isLoading } = useHydrationStore()
  const [dateOfBirth, setDateOfBirth] = useState(formatDateToInput(user?.dateOfBirth))

  useEffect(() => {
    if (isOpen && user) {
      setDateOfBirth(formatDateToInput(user.dateOfBirth))
    }
  }, [isOpen, user])

  const handleSave = async () => {
    await updateUser({
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
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
                <Cake className="size-6 text-blue-300" />
              </div>
              <SheetTitle className="text-[26px] font-[1000] text-white tracking-tight text-center leading-none">
                 Date of Birth
              </SheetTitle>
              <SheetDescription className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.15em] text-center">
                 WHEN IS YOUR SPECIAL DAY?
              </SheetDescription>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 size-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />
          </div>

          <div className="flex-1 px-6 py-6">
            <div className="flex flex-col gap-4">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">Select Your Birthday</Label>
              <DateDropdownPicker value={dateOfBirth} onChange={setDateOfBirth} />
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

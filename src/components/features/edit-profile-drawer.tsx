"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
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
import { Camera } from "lucide-react"
import { AvatarActionSheet } from "@/components/features/avatar-action-sheet"

interface EditProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const COLORS = [
  "#2563eb", // Blue
  "#4f46e5", // Indigo
  "#7c3aed", // Purple
  "#db2777", // Pink
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
]

export function EditProfileDrawer({ isOpen, onClose }: EditProfileDrawerProps) {
  const { user, updateUser } = useHydrationStore()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || COLORS[0])
  const [isAvatarSheetOpen, setIsAvatarSheetOpen] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setAvatarColor(user.avatarColor || COLORS[0])
    }
  }, [isOpen, user])

  const handleSave = () => {
    updateUser({
      name,
      email,
      avatarColor,
    })
    onClose()
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
        <SheetContent side="bottom" className="mx-auto max-h-[92vh] max-w-[420px] overflow-hidden p-0 border-none bg-[#f0f2f5] shadow-2xl" showCloseButton={false}>
          <div className="flex flex-col h-full bg-[#f0f2f5]">
            {/* Header */}
            <div className="px-6 pt-10 pb-6 flex flex-col gap-1 bg-white rounded-b-[2.5rem] shadow-sm">
              <SheetTitle className="text-[26px] font-[1000] text-[#0d1f3c] tracking-tight text-center leading-none">
                 Edit Profile
              </SheetTitle>
              <SheetDescription className="text-[11px] font-[800] text-slate-400 uppercase tracking-[0.14em] text-center">
                 Update your personal details
              </SheetDescription>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
              <div className="flex flex-col gap-6">
                {/* Avatar Preview & Color Picker */}
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="relative">
                    <div 
                      onClick={() => setIsAvatarSheetOpen(true)}
                      className="size-24 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl transition-all duration-300 overflow-hidden cursor-pointer relative border-4 border-white"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {user?.avatarImage ? (
                        <img src={user.avatarImage} alt="Profile" className="size-full object-cover" />
                      ) : (
                        name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                  </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Profile Color</Label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatarColor(color)}
                        className={cn(
                          "size-10 rounded-full border-2 transition-all duration-200 shadow-sm flex items-center justify-center",
                          avatarColor === color ? "border-blue-600 scale-110" : "border-white hover:scale-105 shadow-inner"
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {avatarColor === color && <Check className="size-5 text-white shadow-sm stroke-[4px]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 rounded-2xl border-2 border-white bg-white px-5 text-base font-bold text-[#0d1f3c] shadow-sm focus:border-blue-500 transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</Label>
                  <Input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    className="h-14 rounded-2xl border-2 border-white bg-white px-5 text-base font-bold text-[#0d1f3c] shadow-sm focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 pt-5 pb-10 flex flex-col gap-3 bg-white rounded-t-[2.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.08)] shrink-0 border-t border-slate-50">
            <Button 
              className="h-16 w-full rounded-2xl text-[17px] font-[1000] !bg-blue-600 !text-white shadow-2xl shadow-blue-200 transition-all active:scale-[0.97]"
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button 
              variant="outline"
              className="h-13 w-full rounded-2xl border-2 border-slate-100 text-sm font-[900] text-slate-400 hover:bg-slate-50 transition-all active:scale-[0.97]"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <AvatarActionSheet 
      isOpen={isAvatarSheetOpen} 
      onClose={() => setIsAvatarSheetOpen(false)} 
      hasPhoto={!!user?.avatarImage}
      imageUrl={user?.avatarImage}
    />
  </>
)
}

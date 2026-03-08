"use client"

import { useRef, useState } from "react"
import { Camera, Image as ImageIcon, Eye, X, User } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useHydrationStore } from "@/store"
import { cn } from "@/lib/utils"

interface AvatarActionSheetProps {
  isOpen: boolean
  onClose: () => void
  hasPhoto: boolean
  imageUrl?: string
}

export function AvatarActionSheet({ isOpen, onClose, hasPhoto, imageUrl }: AvatarActionSheetProps) {
  const { updateUser } = useHydrationStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        updateUser({ avatarImage: base64String })
        onClose()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLibraryClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Fullscreen Photo Viewer */}
      {showFullscreen && imageUrl && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setShowFullscreen(false)}
            className="absolute top-12 right-6 size-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-all"
          >
            <X className="size-6" />
          </button>
          
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative size-[320px] rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <img src={imageUrl} alt="Profile Full" className="size-full object-cover" />
            </div>
          </div>
          
          <div className="p-12 text-center">
             <p className="text-white font-bold text-lg">Profile Photo</p>
          </div>
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
        <SheetContent side="bottom" className="mx-auto max-w-[420px] rounded-t-[20px] bg-[#f0f2f5] p-0 border-none shadow-2xl" showCloseButton={false}>
          <div className="flex flex-col h-full bg-[#f0f2f5]">
            <div className="flex justify-center pt-4 pb-2">
              <div className="h-1.5 w-12 rounded-full bg-slate-300" />
            </div>

            <div className="px-6 pt-2 pb-6 flex flex-col gap-1 bg-white rounded-b-[2.5rem] shadow-sm">
              <SheetTitle className="text-xl font-[1000] text-[#0d1f3c] tracking-tight text-center leading-none">
                {hasPhoto ? "Manage Photo" : "Profile Photo"}
              </SheetTitle>
              <SheetDescription className="text-[10px] font-[800] text-slate-400 uppercase tracking-widest text-center mt-1">
                {hasPhoto ? "Customize your appearance" : "Choose how you want to add your photo"}
              </SheetDescription>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {hasPhoto ? (
                <>
                  <button
                    onClick={() => {
                      setShowFullscreen(true)
                      onClose()
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-white active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                        <Eye className="size-5" />
                      </div>
                      <span className="text-[15px] font-bold text-[#0d1f3c]">View Photo</span>
                    </div>
                  </button>

                  <button
                    onClick={handleLibraryClick}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-white active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                        <Camera className="size-5" />
                      </div>
                      <span className="text-[15px] font-bold text-[#0d1f3c]">Change Photo</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      alert("Take Photo feature coming soon!")
                      onClose()
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-white active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                        <Camera className="size-5" />
                      </div>
                      <span className="text-[15px] font-bold text-[#0d1f3c]">Take Photo</span>
                    </div>
                  </button>

                  <button
                    onClick={handleLibraryClick}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm border border-white active:scale-[0.98] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                        <ImageIcon className="size-5" />
                      </div>
                      <span className="text-[15px] font-bold text-[#0d1f3c]">Choose from Library</span>
                    </div>
                  </button>
                </>
              )}
              
              <button
                onClick={onClose}
                className="w-full mt-2 p-5 rounded-2xl bg-white text-red-500 text-[15px] font-black active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

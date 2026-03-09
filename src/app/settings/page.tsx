"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightFromLine, RefreshCw, ChevronRight, Pencil, Camera, Bell, Clock, Info } from "lucide-react"
import { useHydrationStore } from "@/store"
import { BottomNav } from "@/components/features/bottom-nav"
import { Button } from "@/components/ui/button"
import { DAILY_GOAL_OPTIONS } from "@/types"
import { cn } from "@/lib/utils"
import { EditProfileDrawer } from "@/components/features/edit-profile-drawer"
import { AvatarActionSheet } from "@/components/features/avatar-action-sheet"
import { WeightEditDrawer } from "@/components/features/weight-edit-drawer"
import { HeightEditDrawer } from "@/components/features/height-edit-drawer"
import { DOBEditDrawer } from "@/components/features/dob-edit-drawer"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isOnboarded, setUser, setIsOnboarded, setTodayLogs } = useHydrationStore()
  const [showGoalPicker, setShowGoalPicker] = useState(false)
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false)
  const [isAvatarSheetOpen, setIsAvatarSheetOpen] = useState(false)
  const [isWeightDrawerOpen, setIsWeightDrawerOpen] = useState(false)
  const [isHeightDrawerOpen, setIsHeightDrawerOpen] = useState(false)
  const [isDOBDrawerOpen, setIsDOBDrawerOpen] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission)
    }
  }, [])

  useEffect(() => {
    if (!isOnboarded) {
      router.push("/onboarding")
    }
  }, [isOnboarded, router])

  if (!isOnboarded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1f3c]">
        <p className="text-white/50 text-sm">Loading SipSense...</p>
      </div>
    )
  }

  const handleResetData = () => {
    if (confirm("Reset today's hydration data?")) {
      setTodayLogs([])
    }
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to start over? This will reset your profile and all hydration data.")) {
      setUser(null)
      setIsOnboarded(false)
      setTodayLogs([])
      router.push("/onboarding")
    }
  }

  // Helper function to update user data
  const updateUser = (data: Partial<typeof user>) => {
    useHydrationStore.getState().updateUser(data)
  };

  const handleToggleReminders = async () => {
    if (!user) return
    const nextState = !user.remindersEnabled
    if (nextState) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        setNotifPermission(permission)
        if (permission !== 'granted') {
          // If they denied, we still update the toggle but the manager won't show notifs
          // However the requirements say "If denied, show info card".
        }
      }
    }
    updateUser({ remindersEnabled: nextState })
  }

  return (
    <div className="relative min-h-screen bg-[#f0f2f5] pb-36">
      {/* ── Dark Navy Header ── */}
      <div className="absolute top-0 left-0 right-0 h-[32vh] bg-gradient-to-b from-[#0a1628] to-[#0d1f3c] z-0" />
      
      <div className="relative z-10 px-6 pt-20">
        <h1 className="text-[24px] font-bold text-white tracking-tight mb-8">Settings</h1>

        <div className="flex flex-col gap-5">
          {/* ── Profile Card ── */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/10 flex items-center gap-5 relative focus-within:ring-2 ring-blue-400/20">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div 
                onClick={() => setIsAvatarSheetOpen(true)}
                className="size-16 rounded-full flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden cursor-pointer active:scale-95 transition-transform relative border-2 border-white/20"
                style={{ backgroundColor: user.avatarColor || "#2563eb" }}
              >
                {user.avatarImage ? (
                  <img src={user.avatarImage} alt="Profile" className="size-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-white">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>

            {/* Info Section */}
            <button 
              onClick={() => setIsProfileDrawerOpen(true)}
              className="flex-1 flex flex-col gap-1 text-left active:opacity-70 transition-opacity"
            >
              <div className="relative">
                {/* Subtle text overlay for readability */}
                <div className="absolute -inset-x-3 -inset-y-2 bg-black/5 blur-xl rounded-full -z-10" />
                <p className="text-xl font-bold text-white leading-none tracking-tight">{user.name || "User"}</p>
                <p className="text-[13px] font-medium text-[#cbd5e1]">{user.email || "Add your email"}</p>
              </div>
            </button>
          </div>

          {/* ── Hydration Goal Card ── */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Daily Hydration Goal</p>
                <p className="text-xl font-[900] text-[#0d1f3c]">{user.dailyGoal} ml</p>
              </div>
              <Button 
                onClick={() => setShowGoalPicker(!showGoalPicker)}
                className="h-9 px-6 rounded-full !bg-blue-600 !text-white text-xs font-black shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                Change
              </Button>
            </div>
            
            {showGoalPicker && (
              <div className="grid grid-cols-3 gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {DAILY_GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      updateUser({ dailyGoal: goal })
                      setShowGoalPicker(false)
                    }}
                    className={cn(
                      "h-12 rounded-xl border text-sm font-black transition-all active:scale-95",
                      user.dailyGoal === goal 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                        : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {goal} ml
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Body Information Card ── */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">Body Information</p>
            
            <div className="flex flex-col gap-1">
              {[
                { 
                  label: "Weight", 
                  value: user.weight ? `${user.weight} ${user.weightUnit || 'kg'}` : "Not set", 
                  onClick: () => setIsWeightDrawerOpen(true) 
                },
                { 
                  label: "Height", 
                  value: user.height ? 
                    (user.heightUnit === 'ft' ? 
                      `${Math.floor((user.height / 2.54) / 12)} ft ${Math.round((user.height / 2.54) % 12)} in` : 
                      `${user.height} cm`) : 
                    "Not set", 
                  onClick: () => setIsHeightDrawerOpen(true) 
                },
                { 
                  label: "Age", 
                  value: user.age ? `${user.age} years` : "Not set", 
                  onClick: () => { } 
                },
              ].map((item, idx, arr) => (
                <button 
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center justify-between p-4 px-2 hover:bg-slate-50 transition-all rounded-xl group",
                    idx !== arr.length - 1 && "border-b border-slate-50"
                  )}
                >
                  <span className="text-[15px] font-bold text-[#0d1f3c]">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[15px] font-black",
                      item.value === "Not set" ? "text-blue-500" : "text-slate-400"
                    )}>
                      {item.value}
                    </span>
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Reminders Card ── */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Bell className={cn("size-5", user.remindersEnabled ? "text-blue-500" : "text-slate-300")} />
                <span className="text-[15px] font-bold text-[#0d1f3c]">Drink Reminders</span>
              </div>
              <button 
                onClick={handleToggleReminders}
                className={cn(
                  "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  user.remindersEnabled ? "bg-blue-600" : "bg-slate-200"
                )}
              >
                <span 
                  className={cn(
                    "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    user.remindersEnabled ? "translate-x-5" : "translate-x-0"
                  )} 
                />
              </button>
            </div>

            {user.remindersEnabled && (
              <div className="flex flex-col gap-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Time Inputs Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input 
                        type="time" 
                        value={user.reminderStart || "08:00"}
                        onChange={(e) => updateUser({ reminderStart: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">End Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input 
                        type="time" 
                        value={user.reminderEnd || "22:00"}
                        onChange={(e) => updateUser({ reminderEnd: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">Reminder Interval</label>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    step="15"
                    value={user.reminderInterval || 60}
                    onChange={(e) => updateUser({ reminderInterval: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-center text-sm font-medium text-gray-600">
                    {((user.reminderInterval || 60) >= 60) 
                      ? `${(user.reminderInterval || 60) / 60} hour${((user.reminderInterval || 60) / 60) > 1 ? 's' : ''}` 
                      : `${user.reminderInterval || 60} minutes`}
                  </div>
                </div>
              </div>
            )}

            {notifPermission === 'denied' && user.remindersEnabled && (
              <div className="mt-6 p-4 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-100/50 flex items-start gap-4 animate-in zoom-in-95 duration-300">
                <div className="shrink-0 size-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Info className="size-4 text-blue-600" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-bold text-blue-900 leading-tight tracking-tight">Permission Required</p>
                  <p className="text-[11px] font-medium text-blue-700/80 leading-relaxed">Enable notifications in your browser settings to receive reminders.</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col gap-3 mt-6 px-1">
            <Button 
              variant="outline" 
              className="h-14 w-full rounded-[12px] border-[1.5px] border-[#e2e8f0] bg-white text-[15px] font-bold text-[#0d1f3c] hover:bg-slate-50 flex items-center justify-start px-6 gap-3 shadow-sm transition-all active:scale-[0.98]"
              onClick={handleResetData}
            >
              <RefreshCw className="size-5 text-slate-400" />
              Reset today&apos;s data
            </Button>
            
            <Button 
              variant="outline" 
              className="h-14 w-full rounded-[12px] border-[1.5px] border-[#e2e8f0] bg-white text-[15px] font-bold text-red-500 hover:bg-red-50 flex items-center justify-start px-6 gap-3 shadow-sm transition-all active:scale-[0.98]"
              onClick={handleLogout}
            >
              <ArrowRightFromLine className="size-5 text-red-400" />
              Start over
            </Button>
          </div>

          {/* ── Version Label ── */}
          <div className="flex justify-center mt-8 mb-4">
             <p className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">SipSense v1.0</p>
          </div>
        </div>
      </div>

      <EditProfileDrawer 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)} 
      />

      <AvatarActionSheet 
        isOpen={isAvatarSheetOpen} 
        onClose={() => setIsAvatarSheetOpen(false)} 
        hasPhoto={!!user.avatarImage}
        imageUrl={user.avatarImage}
      />

      <WeightEditDrawer 
        isOpen={isWeightDrawerOpen}
        onClose={() => setIsWeightDrawerOpen(false)}
      />

      <HeightEditDrawer 
        isOpen={isHeightDrawerOpen}
        onClose={() => setIsHeightDrawerOpen(false)}
      />

      <DOBEditDrawer 
        isOpen={isDOBDrawerOpen}
        onClose={() => setIsDOBDrawerOpen(false)}
      />

      <BottomNav currentPath="/settings" />
    </div>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DrinkLogEntry, UserProfile } from '@/types'

interface HydrationState {
  // User profile
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  updateUser: (updates: Partial<UserProfile>) => void
  
  // Today's drink logs
  todayLogs: DrinkLogEntry[]
  addDrinkLog: (log: DrinkLogEntry) => void
  removeDrinkLog: (id: string) => void
  setTodayLogs: (logs: DrinkLogEntry[]) => void
  
  // Computed values
  getTodayTotal: () => number
  getTodayHydration: () => number
  getRemaining: () => number
  getProgress: () => number
  
  // Onboarding state
  isOnboarded: boolean
  setIsOnboarded: (value: boolean) => void
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      // User profile
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      // Today's drink logs
      todayLogs: [],
      addDrinkLog: (log) => set((state) => ({
        todayLogs: [log, ...state.todayLogs]
      })),
      removeDrinkLog: (id) => set((state) => ({
        todayLogs: state.todayLogs.filter((log) => log.id !== id)
      })),
      setTodayLogs: (logs) => set({ todayLogs: logs }),
      
      // Computed values
      getTodayTotal: () => {
        const { todayLogs } = get()
        return todayLogs.reduce((sum, log) => sum + log.quantityMl, 0)
      },
      
      getTodayHydration: () => {
        const { todayLogs } = get()
        return todayLogs.reduce((sum, log) => sum + log.hydrationAmount, 0)
      },
      
      getRemaining: () => {
        const { user, getTodayHydration } = get()
        if (!user) return 2500
        return Math.max(0, user.dailyGoal - getTodayHydration())
      },
      
      getProgress: () => {
        const { user, getTodayHydration } = get()
        if (!user) return 0
        return Math.round((getTodayHydration() / user.dailyGoal) * 100)
      },
      
      // Onboarding state
      isOnboarded: false,
      setIsOnboarded: (value) => set({ isOnboarded: value }),
    }),
    {
      name: 'sipsense-storage',
      partialize: (state) => ({
        user: state.user,
        todayLogs: state.todayLogs,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
)

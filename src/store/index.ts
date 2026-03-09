import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DrinkLogEntry, UserProfile } from '@/types'
import { supabase } from '@/lib/supabaseClient'

const FIXED_USER_ID = '00000000-0000-0000-0000-000000000001'

interface HydrationState {
  // User profile
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  success: string | null
  setUser: (user: UserProfile | null) => Promise<void>
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  
  // Today's drink logs
  todayLogs: DrinkLogEntry[]
  addDrinkLog: (log: DrinkLogEntry) => Promise<void>
  removeDrinkLog: (id: string) => Promise<void>
  setTodayLogs: (logs: DrinkLogEntry[]) => void
  
  // Data Fetching
  fetchInitialData: (userId?: string) => Promise<void>
  
  // Computed values
  getTodayTotal: () => number
  getTodayHydration: () => number
  getRemaining: () => number
  getProgress: () => number
  
  // Onboarding state
  isOnboarded: boolean
  setIsOnboarded: (value: boolean) => void
  
  // Onboarding complete flag
  onboardingComplete: boolean
  setOnboardingComplete: (value: boolean) => void
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      error: null,
      success: null,
      todayLogs: [],
      isOnboarded: false,
      onboardingComplete: false,

      // User profile actions
      setUser: async (user) => {
        set({ user, isLoading: true, error: null, success: null })
        if (user) {
          try {
            const userId = FIXED_USER_ID
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: userId,
                name: user.name || 'User',
                email: user.email || 'user@sipsense.app',
                avatar_url: user.avatarImage,
                weight: user.weight,
                weight_unit: user.weightUnit,
                height: user.height,
                height_unit: user.heightUnit,
                age: user.age || null,
                daily_goal: user.dailyGoal,
                reminders_enabled: user.remindersEnabled || false,
                reminder_start: user.reminderStart || '08:00',
                reminder_end: user.reminderEnd || '22:00',
                reminder_interval: user.reminderInterval || 60
              })
            if (error) throw error
            set({ success: 'Saved! ✅' })
          } catch (err: any) {
            console.error('Supabase Error:', JSON.stringify(err), err.message, err.details, err.hint)
            set({ error: 'Something went wrong ❌' })
          }
        }
        set({ isLoading: false })
      },

      updateUser: async (updates) => {
        const currentUser = get().user
        const userId = currentUser?.id || FIXED_USER_ID
        
        // Optimistic update
        const updatedUser = currentUser 
          ? { ...currentUser, ...updates } 
          : { id: userId, email: 'user@sipsense.app', dailyGoal: 2500, ...updates } as UserProfile

        set({ user: updatedUser, isLoading: true, error: null, success: null })

        try {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              name: updatedUser.name,
              email: updatedUser.email,
              avatar_url: updatedUser.avatarImage,
              weight: updatedUser.weight,
              weight_unit: updatedUser.weightUnit,
              height: updatedUser.height,
              height_unit: updatedUser.heightUnit,
              age: updatedUser.age || null,
              daily_goal: updatedUser.dailyGoal,
              reminders_enabled: updatedUser.remindersEnabled ?? false,
              reminder_start: updatedUser.reminderStart ?? '08:00',
              reminder_end: updatedUser.reminderEnd ?? '22:00',
              reminder_interval: updatedUser.reminderInterval ?? 60
            })
          if (error) throw error
          set({ success: 'Saved! ✅' })
        } catch (err: any) {
          console.error('Supabase Error:', JSON.stringify(err), err.message, err.details, err.hint)
          // Provide more specific error messages
          if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
            set({ error: 'Unable to connect. Please check your internet connection.' })
          } else if (err.message?.includes('network')) {
            set({ error: 'Network error. Please try again.' })
          } else {
            set({ error: 'Something went wrong ❌' })
          }
        } finally {
          set({ isLoading: false })
        }
      },
      
      // Today's drink logs actions
      addDrinkLog: async (log) => {
        const user = get().user
        const userId = user?.id || FIXED_USER_ID

        set((state) => ({ 
          todayLogs: [log, ...state.todayLogs],
          isLoading: true,
          error: null,
          success: null
        }))

        try {
          const { error } = await supabase
            .from('drink_logs')
            .insert({
              id: log.id,
              drink_type: log.drinkType,
              amount_ml: log.quantityMl,
              hydration_ml: log.hydrationAmount,
              logged_at: log.createdAt.toISOString()
            })
          if (error) throw error
          set({ success: 'Saved! ✅' })
        } catch (err: any) {
          console.error('Supabase Error:', JSON.stringify(err), err.message, err.details, err.hint)
          set({ error: 'Something went wrong ❌' })
        } finally {
          set({ isLoading: false })
        }
      },

      removeDrinkLog: async (id) => {
        set((state) => ({ 
          todayLogs: state.todayLogs.filter((log) => log.id !== id),
          isLoading: true,
          error: null,
          success: null
        }))

        try {
          const { error } = await supabase
            .from('drink_logs')
            .delete()
            .eq('id', id)
          if (error) throw error
          set({ success: 'Saved! ✅' })
        } catch (err: any) {
          console.error('Supabase Error:', JSON.stringify(err), err.message, err.details, err.hint)
          set({ error: 'Something went wrong ❌' })
        } finally {
          set({ isLoading: false })
        }
      },

      setTodayLogs: (logs) => set({ todayLogs: logs }),
      
      // Data Fetching
      fetchInitialData: async (userIdOverride) => {
        const userId = userIdOverride || FIXED_USER_ID
        set({ isLoading: true, error: null, success: null })
        try {
          // Fetch Profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          if (profileError && profileError.code !== 'PGRST116') throw profileError
          
          if (!profile) {
            // If profile doesn't exist, create a default one
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                name: 'User',
                email: 'user@sipsense.app',
                daily_goal: 2500
              })
            
            if (insertError) throw insertError
            
            set({ 
              user: {
                id: userId,
                name: 'User',
                email: 'user@sipsense.app',
                dailyGoal: 2500
              },
              isOnboarded: true
            })
          } else {
            set({ 
              user: {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                avatarImage: profile.avatar_url,
                weight: profile.weight,
                weightUnit: profile.weight_unit,
                height: profile.height,
                heightUnit: profile.height_unit,
                age: profile.age || undefined,
                dailyGoal: profile.daily_goal,
                remindersEnabled: profile.reminders_enabled,
                reminderStart: profile.reminder_start,
                reminderEnd: profile.reminder_end,
                reminderInterval: profile.reminder_interval
              },
              isOnboarded: true
            })
          }

          // Fetch Today's Logs
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const { data: logs, error: logsError } = await supabase
            .from('drink_logs')
            .select('*')
            .gte('logged_at', today.toISOString())
            .order('logged_at', { ascending: false })

          if (logsError) throw logsError

          if (logs) {
            set({
              todayLogs: logs.map((log: any) => ({
                id: log.id,
                drinkType: log.drink_type,
                quantityMl: log.amount_ml,
                hydrationAmount: log.hydration_ml,
                createdAt: new Date(log.logged_at)
              }))
            })
          }
        } catch (err: any) {
          console.error('Supabase Fetch Error:', JSON.stringify(err), err.message, err.details, err.hint)
          set({ error: 'Something went wrong ❌' })
        } finally {
          set({ isLoading: false })
        }
      },

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
      setIsOnboarded: (value) => set({ isOnboarded: value }),
      
      // Onboarding complete flag
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
    }),
    {
      name: 'sipsense-storage',
      partialize: (state) => ({
        user: state.user,
        todayLogs: state.todayLogs,
        isOnboarded: state.isOnboarded,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
)

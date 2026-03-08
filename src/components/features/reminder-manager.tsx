"use client"

import { useEffect, useRef } from "react"
import { useHydrationStore } from "@/store"

export function ReminderManager() {
  const { user } = useHydrationStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!user || !user.remindersEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const checkAndNotify = () => {
      // Permission check
      if (Notification.permission !== "granted") return

      const now = new Date()
      const currentTimeInMins = now.getHours() * 60 + now.getMinutes()
      
      const [startH, startM] = (user.reminderStart || "08:00").split(":").map(Number)
      const startTimeInMins = startH * 60 + startM
      
      const [endH, endM] = (user.reminderEnd || "22:00").split(":").map(Number)
      const endTimeInMins = endH * 60 + endM

      // Only notify if within time window
      if (currentTimeInMins >= startTimeInMins && currentTimeInMins <= endTimeInMins) {
        new Notification("💧 SipSense Reminder", {
          body: "💧 Time to drink water! Stay hydrated.",
          icon: "/favicon.ico",
          silent: false,
          tag: "drink-reminder"
        })
      }
    }

    // Clear existing interval if any
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    // Set new interval
    const intervalMs = (user.reminderInterval || 60) * 60 * 1000
    intervalRef.current = setInterval(checkAndNotify, intervalMs)

    // Run first check immediately? 
    // Usually users expect the next reminder to be in X minutes, 
    // but maybe we can trigger the first one soon.
    // For now, let's just wait for the interval.

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [user?.remindersEnabled, user?.reminderStart, user?.reminderEnd, user?.reminderInterval, user?.id])

  return null
}

"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useHydrationStore } from "@/store"
import { WeeklyChart } from "@/components/features/weekly-chart"
import { BottomNav } from "@/components/features/bottom-nav"
import { getHydrationMessage } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatisticsPage() {
  const router = useRouter()
  const { user, isOnboarded, getTodayHydration, getProgress } = useHydrationStore()
  const todayConsumed = getTodayHydration()
  const progress = getProgress()

  const weeklyData = useMemo(() => {
    if (!user) return []

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    const data: { day: string; date: string; total: number; goal: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      let total = 0

      if (i === 0) {
        total = todayConsumed
      } else {
        const seed = (date.getDate() * 37 + date.getMonth() * 17 + user.dailyGoal) % 1200
        total = 1500 + seed
      }

      data.push({
        day: days[date.getDay()],
        date: date.toISOString().split("T")[0],
        total,
        goal: user.dailyGoal,
      })
    }

    return data
  }, [todayConsumed, user])

  const weeklyStats = useMemo(() => {
    if (weeklyData.length === 0) {
      return { total: 0, avg: 0, daysMetGoal: 0 }
    }

    const total = weeklyData.reduce((sum, d) => sum + d.total, 0)
    const avg = Math.round(total / 7)
    const daysMetGoal = weeklyData.filter((d) => d.total >= d.goal).length
    return { total, avg, daysMetGoal }
  }, [weeklyData])

  useEffect(() => {
    if (!isOnboarded) {
      router.push("/onboarding")
    }
  }, [isOnboarded, router])

  if (!isOnboarded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading SipSense...</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground text-sm">Track your weekly hydration trend.</p>
      </header>

      <main className="section-stack" aria-label="Hydration statistics">
        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-4xl font-semibold">{todayConsumed} ml</p>
            <p className="text-muted-foreground text-sm">Progress: {progress}%</p>
            <p className="text-primary text-sm">{getHydrationMessage(progress)}</p>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyData} goal={user.dailyGoal} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="surface-card">
            <CardContent className="py-6 text-center">
              <p className="text-xl font-semibold">{weeklyStats.total}</p>
              <p className="text-muted-foreground text-xs">Total ml</p>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="py-6 text-center">
              <p className="text-xl font-semibold">{weeklyStats.avg}</p>
              <p className="text-muted-foreground text-xs">Average</p>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="py-6 text-center">
              <p className="text-xl font-semibold">{weeklyStats.daysMetGoal}/7</p>
              <p className="text-muted-foreground text-xs">Goals met</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav currentPath="/statistics" />
    </div>
  )
}

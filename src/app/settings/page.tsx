"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightFromLine, RefreshCw } from "lucide-react"
import { useHydrationStore } from "@/store"
import { BottomNav } from "@/components/features/bottom-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SelectNative } from "@/components/ui/select-native"
import { Separator } from "@/components/ui/separator"
import { DAILY_GOAL_OPTIONS } from "@/types"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isOnboarded, setUser, setIsOnboarded, setTodayLogs } = useHydrationStore()
  const [showGoalPicker, setShowGoalPicker] = useState(false)

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

  const handleGoalChange = (goal: number) => {
    setUser({ ...user, dailyGoal: goal })
    setShowGoalPicker(false)
  }

  const handleResetData = () => {
    if (confirm("Reset today's hydration data?")) {
      setTodayLogs([])
    }
  }

  const handleLogout = () => {
    if (confirm("Reset profile and restart onboarding?")) {
      setUser(null)
      setIsOnboarded(false)
      setTodayLogs([])
      router.push("/onboarding")
    }
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </header>

      <main className="section-stack" aria-label="Settings">
        <Card className="surface-card">
          <CardContent className="flex items-center gap-6 py-8">
            <Avatar className="size-14 ring-2 ring-primary/10">
              <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-semibold">{user.name || "User"}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Daily Hydration Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              variant="outline"
              className="h-12 w-full justify-between px-4"
              onClick={() => setShowGoalPicker((v) => !v)}
              aria-expanded={showGoalPicker}
              aria-controls="goal-select"
            >
              <span>{user.dailyGoal} ml</span>
              <span className="text-muted-foreground text-xs">Change</span>
            </Button>
            {showGoalPicker ? (
              <div className="space-y-3">
                <Label htmlFor="goal-select">Goal options</Label>
                <SelectNative
                  id="goal-select"
                  value={String(user.dailyGoal)}
                  onChange={(e) => handleGoalChange(Number(e.target.value))}
                >
                  {DAILY_GOAL_OPTIONS.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal} ml
                    </option>
                  ))}
                </SelectNative>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Body Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span>{user.weight ? `${user.weight} kg` : "Not set"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Height</span>
              <span>{user.height ? `${user.height} cm` : "Not set"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date of Birth</span>
              <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not set"}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button variant="outline" className="h-12 w-full justify-start px-4" onClick={handleResetData}>
            <RefreshCw className="mr-2 size-5" />
            Reset today&apos;s data
          </Button>
          <Button variant="destructive" className="h-12 w-full justify-start px-4" onClick={handleLogout}>
            <ArrowRightFromLine className="mr-2 size-5" />
            Start over
          </Button>
        </div>
      </main>

      <BottomNav currentPath="/settings" />
    </div>
  )
}

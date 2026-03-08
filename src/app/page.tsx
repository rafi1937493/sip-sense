"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useHydrationStore } from "@/store"
import { NeumorphicHydrationWidget } from "@/components/features/neumorphic-hydration-widget"
import { DrinkCard, QuickDrinkButton } from "@/components/features/drink-card"
import { DrinkHistoryList } from "@/components/features/drink-history-list"
import { BottomNav, FloatingAddButton } from "@/components/features/bottom-nav"
import { AddDrinkSheet } from "@/components/features/add-drink-sheet"
import { calculateHydration, getHydrationMessage, QUICK_DRINKS, type DrinkType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { user, todayLogs, isOnboarded, addDrinkLog, removeDrinkLog, getTodayHydration, getProgress, getRemaining } =
    useHydrationStore()

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

  const consumed = getTodayHydration()
  const goal = user.dailyGoal
  const progress = getProgress()
  const remaining = getRemaining()

  const handleQuickAdd = (drinkType: DrinkType) => {
    const quickDrink = QUICK_DRINKS.find((d) => d.type === drinkType)
    const quantityMl = quickDrink?.defaultMl || 250
    const hydrationAmount = calculateHydration(quantityMl, drinkType)

    addDrinkLog({
      id: crypto.randomUUID(),
      drinkType,
      quantityMl,
      hydrationAmount,
      createdAt: new Date(),
    })
  }

  const handleAddDrink = (drinkType: DrinkType, quantityMl: number) => {
    const hydrationAmount = calculateHydration(quantityMl, drinkType)

    addDrinkLog({
      id: crypto.randomUUID(),
      drinkType,
      quantityMl,
      hydrationAmount,
      createdAt: new Date(),
    })
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">SipSense</h1>
            <p className="text-muted-foreground text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Badge variant={progress >= 100 ? "default" : "secondary"}>{progress}%</Badge>
        </div>
      </header>

      <main className="section-stack" aria-label="Hydration dashboard">
        <NeumorphicHydrationWidget currentMl={consumed} goalMl={goal} className="mb-2" />

        <Card className="surface-card">
          <CardContent className="space-y-3 py-7 text-center">
            <p className="text-lg font-medium">{getHydrationMessage(progress)}</p>
            <p className="text-muted-foreground text-sm">
              {remaining > 0 ? `${remaining}ml remaining` : `${consumed - goal}ml above goal`}
            </p>
            <p className="sr-only" aria-live="polite">
              Hydration progress updated to {progress} percent
            </p>
          </CardContent>
        </Card>

        <DrinkCard onAddDrink={() => setIsSheetOpen(true)} currentMl={consumed} goalMl={goal} />

        <Card className="surface-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Add</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {QUICK_DRINKS.map((drink) => (
                <QuickDrinkButton key={drink.type} type={drink.type} onClick={handleQuickAdd} />
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3" aria-labelledby="today-drinks-heading">
          <h2 id="today-drinks-heading" className="text-base font-semibold tracking-wide">
            Today&apos;s Drinks
          </h2>
          <DrinkHistoryList
            logs={todayLogs}
            onDelete={(id) => removeDrinkLog(id)}
            onEdit={(log) => {
              console.log("Edit", log)
            }}
          />
        </section>
      </main>

      <FloatingAddButton onClick={() => setIsSheetOpen(true)} />
      <BottomNav currentPath="/" />
      <AddDrinkSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} onAddDrink={handleAddDrink} />
    </div>
  )
}

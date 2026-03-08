"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useHydrationStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DAILY_GOAL_OPTIONS } from "@/types"

type Step = "welcome" | "info" | "goal"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("welcome")
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    dateOfBirth: "",
    dailyGoal: 2500,
  })

  const { setUser, setIsOnboarded } = useHydrationStore()

  const handleSubmit = () => {
    setUser({
      id: crypto.randomUUID(),
      email: "user@sipsense.app",
      name: "User",
      weight: formData.weight ? Number(formData.weight) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      dailyGoal: formData.dailyGoal,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setIsOnboarded(true)
    router.push("/")
  }

  const handleNext = () => {
    if (step === "welcome") return setStep("info")
    if (step === "info") return setStep("goal")
    handleSubmit()
  }

  const handleBack = () => {
    if (step === "goal") return setStep("info")
    if (step === "info") return setStep("welcome")
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top Header & Navigation */}
      <header className="relative flex h-16 items-center justify-center px-6 pt-4">
        {step !== "welcome" && (
          <button 
            onClick={handleBack}
            className="absolute left-6 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6" />
          </button>
        )}
        
        {/* Pagination Dots */}
        <div className="flex items-center gap-2 mt-2" aria-label={`Onboarding step ${["welcome", "info", "goal"].indexOf(step) + 1} of 3`}>
          {["welcome", "info", "goal"].map((s) => (
            <div 
              key={s} 
              className={`h-2.5 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-[#008fbc] shadow-sm" : "w-2.5 bg-slate-200"}`} 
            />
          ))}
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col px-8 pt-12 pb-24">
        {step === "welcome" ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 3D CSS Droplet effect matching the landing page */}
            <div className="relative flex size-28 items-center justify-center">
              <div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#87ceff_0%,#3b82f6_60%,#1e40af_100%)] shadow-xl"
                style={{
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  transform: "rotate(-45deg)",
                }}
              />
              <div 
                className="absolute top-4 left-4 h-6 w-4 rounded-full bg-white/40 blur-[2px]"
                style={{ transform: "rotate(-45deg)" }}
              />
            </div>
            
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Welcome to SipSense</h1>
              <p className="text-base text-slate-500 mx-auto max-w-[280px]">Track daily hydration in a simple flow.</p>
            </div>
          </div>
        ) : null}

        {step === "info" ? (
          <div className="flex flex-1 flex-col justify-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 text-center mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Body Profile</h1>
              <p className="text-sm text-slate-500">Help us calculate your optimal hydration.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-slate-600 font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="70"
                  className="h-14 border-0 border-b-2 border-slate-200 bg-slate-50 px-4 text-lg focus-visible:border-[#008fbc] focus-visible:ring-0 rounded-t-xl rounded-b-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-slate-600 font-medium">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  placeholder="170"
                  className="h-14 border-0 border-b-2 border-slate-200 bg-slate-50 px-4 text-lg focus-visible:border-[#008fbc] focus-visible:ring-0 rounded-t-xl rounded-b-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-slate-600 font-medium">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="h-14 border-0 border-b-2 border-slate-200 bg-slate-50 px-4 text-lg focus-visible:border-[#008fbc] focus-visible:ring-0 rounded-t-xl rounded-b-none"
                />
              </div>
            </div>
          </div>
        ) : null}

        {step === "goal" ? (
          <div className="flex flex-1 flex-col justify-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 text-center mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Goal</h1>
              <p className="text-sm text-slate-500">Select how much water you want to drink daily.</p>
            </div>

            <div className="space-y-4">
              {DAILY_GOAL_OPTIONS.map((goal) => {
                const selected = formData.dailyGoal === goal
                return (
                  <Button
                    key={goal}
                    variant="outline"
                    className={`h-16 w-full justify-between px-6 text-lg rounded-2xl border-2 transition-all ${
                      selected 
                        ? "border-[#008fbc] bg-[#008fbc]/5 text-[#008fbc]" 
                        : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, dailyGoal: goal }))}
                  >
                    <span className="font-semibold">{goal} ml</span>
                    <div className={`flex size-6 items-center justify-center rounded-full border-2 ${selected ? "border-[#008fbc] bg-[#008fbc]" : "border-slate-300"}`}>
                      {selected && <Check className="size-3.5 text-white" strokeWidth={3} />}
                    </div>
                  </Button>
                )
              })}
              
              <div className="pt-2">
                <Label htmlFor="custom-goal" className="sr-only">Custom Goal</Label>
                <Input
                  id="custom-goal"
                  type="number"
                  value={DAILY_GOAL_OPTIONS.includes(formData.dailyGoal as 2000 | 2500 | 3000) ? "" : formData.dailyGoal || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dailyGoal: Number(e.target.value) || 0 }))}
                  placeholder="Or enter custom goal (ml)"
                  className="h-16 border-2 border-slate-200 bg-transparent px-6 text-lg placeholder:text-slate-400 focus-visible:border-[#008fbc] focus-visible:ring-0 rounded-2xl text-center font-medium"
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Edge-to-edge full width bottom CTA */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2">
        <Button 
          className="h-[72px] w-full rounded-none bg-[#008fbc] hover:bg-[#007499] text-[17px] font-semibold tracking-wide text-white transition-all hover:opacity-95" 
          onClick={handleNext}
        >
          {step === "goal" ? "Get Started" : "Continue"}
          <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>
    </div>
  )
}

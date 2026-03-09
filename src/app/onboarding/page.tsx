"use client"

import { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useHydrationStore } from "@/store"
import { DAILY_GOAL_OPTIONS } from "@/types"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth"

type Step = "welcome" | "info" | "goal"

// Perfect 3D luminous sphere
const WaterSphere = () => (
  <div
    className="relative"
    style={{ width: 180, height: 180 }}
  >
    {/* Main sphere body */}
    <div
      className="absolute inset-0"
      style={{
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 32%, #93c5fd 0%, #60a5fa 20%, #3b82f6 50%, #1d4ed8 75%, #1e3a8a 100%)",
        boxShadow: "0 0 80px 25px rgba(59,130,246,0.30), 0 30px 60px rgba(0,0,0,0.5)",
      }}
    />
    {/* Primary specular highlight (bright white) */}
    <div
      className="absolute bg-white blur-[3px]"
      style={{
        borderRadius: "50%",
        top: "14%", left: "20%",
        width: "30%", height: "22%",
        opacity: 0.7,
      }}
    />
    {/* Secondary soft highlight */}
    <div
      className="absolute bg-white blur-[8px]"
      style={{
        borderRadius: "50%",
        top: "8%", left: "12%",
        width: "50%", height: "38%",
        opacity: 0.18,
      }}
    />
    {/* Bottom rim light */}
    <div
      className="absolute bg-blue-300 blur-[10px]"
      style={{
        borderRadius: "50%",
        bottom: "10%", right: "10%",
        width: "35%", height: "25%",
        opacity: 0.20,
      }}
    />
  </div>
)

// ─── Custom Date Dropdown Picker Components ───

const DateDropdownPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  // Initialize date
  const date = value ? new Date(value) : null;
  const day = date ? date.getDate() : "";
  const month = date ? date.getMonth() : "";
  const year = date ? date.getFullYear() : "";

  const years = Array.from({ length: 71 }, (_, i) => 1940 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Calculate days based on year and month if available, else default 31
  const daysInMonth = (year && typeof month === 'number') 
    ? new Date(Number(year), month + 1, 0).getDate() 
    : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleUpdate = (type: 'd' | 'm' | 'y', val: string) => {
    const newDay = type === 'd' ? Number(val) : (day || 1);
    const newMonth = type === 'm' ? Number(val) : (month === "" ? 0 : Number(month));
    const newYear = type === 'y' ? Number(val) : (year || 2000);
    
    const d = new Date(newYear, newMonth, newDay);
    onChange(d.toISOString().split('T')[0]);
  };

  const selectClasses = "h-14 w-full bg-white rounded-[10px] border-[1.5px] border-[#e2e8f0] px-4 text-base font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm appearance-none";

  return (
    <div className="flex gap-3 mt-1 w-full items-center">
      {/* Month dropdown */}
      <div className="flex-1 relative min-w-0">
        <select 
          value={month} 
          onChange={(e) => handleUpdate('m', e.target.value)}
          className={selectClasses}
        >
          <option value="" disabled>Month</option>
          {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Day dropdown */}
      <div className="flex-1 relative min-w-0">
        <select 
          value={day} 
          onChange={(e) => handleUpdate('d', e.target.value)}
          className={selectClasses}
        >
          <option value="" disabled>Day</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Year dropdown */}
      <div className="flex-1 relative min-w-0">
        <select 
          value={year} 
          onChange={(e) => handleUpdate('y', e.target.value)}
          className={selectClasses}
        >
          <option value="" disabled>Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function PremiumOnboardingPage() {
  const router = useRouter()
  const { data: session, isPending: isLoading } = authClient.useSession()

  // All hooks must be called before any early returns
  const [step, setStep] = useState<Step>("welcome")
  const [formData, setFormData] = useState({
    weight: "",
    weightUnit: "kg" as "kg" | "lbs",
    height: "",
    heightFt: "",
    heightIn: "",
    heightUnit: "cm" as "cm" | "ft",
    dateOfBirth: "",
    dailyGoal: 2500,
  })

  const { setUser, setIsOnboarded } = useHydrationStore()

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (!isLoading && session) {
      router.push("/")
    }
  }, [session, isLoading, router])

  // Smart Hydration Goal Calculation
  const recommendedGoal = useMemo(() => {
    // Return default when loading to maintain hook order
    if (isLoading || !formData.weight || !formData.dateOfBirth) return 2500;
    
    // Weight conversion to kg
    let w = Number(formData.weight);
    if (formData.weightUnit === 'lbs') w = w / 2.20462;
    
    // Age calculation
    const birthDate = new Date(formData.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    
    // Base formula: 35ml per kg of body weight
    let base = w * 35;
    
    // Adjustments for Age
    if (age < 30) base += 100;
    else if (age > 55) base -= 100;
    
    // Round to nearest 50ml
    return Math.round(base / 50) * 50;
  }, [isLoading, formData.weight, formData.weightUnit, formData.dateOfBirth]);

  // Which option is the "Recommended" one?
  const recommendedOption = useMemo(() => {
    const standardOptions = [2000, 2500, 3000];
    const closest = standardOptions.reduce((prev, curr) => 
      Math.abs(curr - recommendedGoal) < Math.abs(prev - recommendedGoal) ? curr : prev
    );
    
    // If exact match or close enough (within 150ml) to a standard option, recommend that
    if (Math.abs(closest - recommendedGoal) <= 150) return closest;
    return "custom";
  }, [recommendedGoal]);

  // Auto-select when arriving at goal step
  useEffect(() => {
    if (step === 'goal') {
      if (typeof recommendedOption === 'number') {
        setFormData(p => ({ ...p, dailyGoal: recommendedOption }));
      } else {
        setFormData(p => ({ ...p, dailyGoal: recommendedGoal }));
      }
    }
  }, [step, recommendedOption, recommendedGoal]);

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    )
  }

  const handleSubmit = () => {
    let finalHeight = undefined
    if (formData.heightUnit === "cm") {
      finalHeight = formData.height ? Number(formData.height) : undefined
    } else {
      const ft = Number(formData.heightFt) || 0
      const inc = Number(formData.heightIn) || 0
      if (ft > 0 || inc > 0) {
        finalHeight = Math.round(((ft * 12) + inc) * 2.54)
      }
    }

    let finalWeight = undefined
    if (formData.weightUnit === "kg") {
      finalWeight = formData.weight ? Number(formData.weight) : undefined
    } else {
      finalWeight = formData.weight ? Math.round(Number(formData.weight) / 2.20462) : undefined
    }

    setUser({
      id: '00000000-0000-0000-0000-000000000001',
      email: "user@sipsense.app",
      name: "User",
      weight: finalWeight,
      height: finalHeight,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      dailyGoal: formData.dailyGoal,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setIsOnboarded(true)
    setTimeout(() => router.push("/"), 200)
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#e8edf4] font-sans">

      {/* ─── Background: dark navy top + light grey bottom ─── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Dark top section */}
        <div
          className="absolute left-0 right-0 top-0 bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a] transition-all duration-700"
          style={{ height: step === "welcome" ? "62%" : "32%" }}
        />
        {/* Wave SVG sits right at the boundary */}
        <div
          className="absolute left-0 right-0 overflow-hidden transition-all duration-700"
          style={{ top: step === "welcome" ? "calc(62% - 1px)" : "calc(32% - 1px)" }}
        >
          <svg
            viewBox="0 0 1440 100"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
            style={{ height: 90 }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C200,90 400,0 600,50 C800,100 1050,10 1200,55 C1300,78 1380,60 1440,45 L1440,100 L0,100 Z"
              fill="#e8edf4"
            />
          </svg>
        </div>
        {/* Light bottom section fills the rest */}
        <div className="absolute inset-0" style={{ zIndex: -1, background: "#e8edf4" }} />
      </div>

      {/* ─── Step indicator dots ─── */}
      <div className="absolute top-12 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {(["welcome", "info", "goal"] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              s === step ? "w-7 bg-blue-400" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* ─── Back button ─── */}
      {step !== "welcome" && (
        <button
          onClick={handleBack}
          className="absolute top-10 left-5 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>
      )}

      {/* ═══════════════════════════════════════════
          STEP: WELCOME
      ═══════════════════════════════════════════ */}
      {step === "welcome" && (
        <div className="absolute inset-0 z-10 animate-in fade-in duration-500">
          {/* Sphere — centered at top 30% of screen */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: "31%" }}
          >
            <WaterSphere />
          </div>

          {/* Text — anchored at 66%, safely in the light grey zone */}
          <div
            className="absolute left-0 right-0 text-center px-8"
            style={{ top: "66%" }}
          >
            <h1 className="text-[2.8rem] font-extrabold tracking-tight text-[#1e293b] leading-tight">
              Sip Sense
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-500 tracking-wide">
              Track hydration naturally.
            </p>
          </div>

          {/* CTA Button — fixed at bottom */}
          <div className="absolute bottom-12 left-0 right-0 px-8">
            <button
              onClick={handleNext}
              className="mx-auto flex h-[58px] w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl bg-[#dde4ee] text-lg font-bold text-[#1e293b] shadow-[6px_6px_16px_#c2ccda,-6px_-6px_16px_#ffffff] transition-all hover:text-blue-700 active:scale-[0.98] active:shadow-[inset_4px_4px_10px_#c2ccda,inset_-4px_-4px_10px_#ffffff]"
            >
              Get Started <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          STEP: INFO
      ═══════════════════════════════════════════ */}
      {step === "info" && (
        <div className="absolute inset-0 z-10 flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">

          {/* ─── Dark Header ─── */}
          <div className="flex flex-col items-center justify-center pt-8" style={{ height: "32%" }}>
            {/* Icon badge */}
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <svg className="size-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Your Profile</h2>
            <p className="mt-1 text-sm font-medium text-blue-200/80">Personalize your hydration plan</p>
          </div>

          {/* ─── Light Form Area ─── */}
          <div className="flex flex-1 flex-col px-6 pt-8">
            <div className="space-y-4">
              {/* Weight with Toggle */}
              <div className="relative">
                <div className="flex items-center justify-between ml-1 mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Weight</label>
                  <div className="flex bg-[#dde4ee] rounded-full p-0.5 shadow-[inset_2px_2px_5px_#c2ccda,inset_-2px_-2px_5px_#ffffff] scale-90 origin-right">
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, weightUnit: "kg" }))}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-bold uppercase rounded-full transition-all duration-300",
                        formData.weightUnit === 'kg' ? "bg-[#2563eb] text-white shadow-md" : "text-slate-500 hover:text-slate-700 bg-transparent"
                      )}
                    >kg</button>
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, weightUnit: "lbs" }))}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-bold uppercase rounded-full transition-all duration-300",
                        formData.weightUnit === 'lbs' ? "bg-[#2563eb] text-white shadow-md" : "text-slate-500 hover:text-slate-700 bg-transparent"
                      )}
                    >lbs</button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    placeholder={formData.weightUnit === 'kg' ? "e.g. 70" : "e.g. 155"}
                    onChange={(e) => setFormData((p) => ({ ...p, weight: e.target.value }))}
                    className="h-14 w-full appearance-none rounded-2xl bg-[#dde4ee] px-5 text-base font-semibold text-slate-800 placeholder:text-slate-400 shadow-[inset_4px_4px_8px_#c2ccda,inset_-4px_-4px_8px_#ffffff] outline-none transition-all focus:shadow-[inset_5px_5px_10px_#c2ccda,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_rgba(59,130,246,0.25)]"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400/80 tracking-widest uppercase">{formData.weightUnit}</span>
                </div>
              </div>

              {/* Height with Toggle */}
              <div className="relative">
                <div className="flex items-center justify-between ml-1 mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Height</label>
                  <div className="flex bg-[#dde4ee] rounded-full p-0.5 shadow-[inset_2px_2px_5px_#c2ccda,inset_-2px_-2px_5px_#ffffff] scale-90 origin-right">
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, heightUnit: "cm" }))}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-bold uppercase rounded-full transition-all duration-300",
                        formData.heightUnit === 'cm' ? "bg-[#2563eb] text-white shadow-md" : "text-slate-500 hover:text-slate-700 bg-transparent"
                      )}
                    >cm</button>
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, heightUnit: "ft" }))}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-bold uppercase rounded-full transition-all duration-300",
                        formData.heightUnit === 'ft' ? "bg-[#2563eb] text-white shadow-md" : "text-slate-500 hover:text-slate-700 bg-transparent"
                      )}
                    >ft/in</button>
                  </div>
                </div>

                {formData.heightUnit === "cm" ? (
                  <div className="relative animate-in fade-in zoom-in-95 duration-300">
                    <input
                      id="height"
                      type="number"
                      value={formData.height || ""}
                      placeholder="e.g. 170"
                      onChange={(e) => setFormData((p) => ({ ...p, height: e.target.value }))}
                      className="h-14 w-full appearance-none rounded-2xl bg-[#dde4ee] px-5 text-base font-semibold text-slate-800 placeholder:text-slate-400 shadow-[inset_4px_4px_8px_#c2ccda,inset_-4px_-4px_8px_#ffffff] outline-none transition-all focus:shadow-[inset_5px_5px_10px_#c2ccda,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_rgba(59,130,246,0.25)]"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400/80 tracking-widest uppercase">cm</span>
                  </div>
                ) : (
                  <div className="flex gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="5"
                        value={formData.heightFt || ""}
                        onChange={(e) => setFormData((p) => ({ ...p, heightFt: e.target.value }))}
                        className="h-14 w-full appearance-none rounded-2xl bg-[#dde4ee] px-5 pr-10 text-base font-semibold text-slate-800 placeholder:text-slate-400 shadow-[inset_4px_4px_8px_#c2ccda,inset_-4px_-4px_8px_#ffffff] outline-none transition-all focus:shadow-[inset_5px_5px_10px_#c2ccda,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_rgba(59,130,246,0.25)]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400/80 tracking-widest uppercase">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="9"
                        value={formData.heightIn || ""}
                        onChange={(e) => setFormData((p) => ({ ...p, heightIn: e.target.value }))}
                        className="h-14 w-full appearance-none rounded-2xl bg-[#dde4ee] px-5 pr-10 text-base font-semibold text-slate-800 placeholder:text-slate-400 shadow-[inset_4px_4px_8px_#c2ccda,inset_-4px_-4px_8px_#ffffff] outline-none transition-all focus:shadow-[inset_5px_5px_10px_#c2ccda,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_rgba(59,130,246,0.25)]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400/80 tracking-widest uppercase">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <label className="ml-1 mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
                  Date of Birth
                </label>
                <DateDropdownPicker 
                  value={formData.dateOfBirth} 
                  onChange={(val) => setFormData(p => ({ ...p, dateOfBirth: val }))} 
                />
              </div>
            </div>
          </div>

          {/* CTA Button — fixed/pinned at very bottom of screen */}
          <div className="absolute bottom-12 left-0 right-0 px-8 z-30">
            <button
              onClick={handleNext}
              className="mx-auto flex h-[58px] w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl bg-[#dde4ee] text-lg font-bold text-[#1e293b] shadow-[6px_6px_14px_#c2ccda,-6px_-6px_14px_#ffffff] transition-all hover:text-blue-700 active:scale-[0.98] active:shadow-[inset_4px_4px_10px_#c2ccda,inset_-4px_-4px_10px_#ffffff]"
            >
              Continue <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          STEP: GOAL
      ═══════════════════════════════════════════ */}
      {step === "goal" && (
        <div className="absolute inset-0 z-10 flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">

          {/* ─── Dark Header ─── */}
          <div className="flex flex-col items-center justify-center pt-8" style={{ height: "32%" }}>
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <svg className="size-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.5 2 5.5 5.5 5.5 9.5c0 5.5 6.5 12.5 6.5 12.5s6.5-7 6.5-12.5C18.5 5.5 15.5 2 12 2zm0 10a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Daily Goal</h2>
            <p className="mt-1 text-sm font-medium text-blue-200/80">Set your daily water target</p>
          </div>

          {/* ─── Light Options Area — content fills the rest with no gaps ─── */}
          <div className="flex flex-1 flex-col justify-between px-6 py-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-4">
                {DAILY_GOAL_OPTIONS.map((goal) => {
                  const isSelected = formData.dailyGoal === goal
                  const isRecommended = recommendedOption === goal
                  return (
                    <div key={goal} className="relative">
                      {isRecommended && (
                        <div className="absolute -top-6 left-4 z-10 rounded-[20px] bg-[#2563eb] px-[10px] py-[3px] text-[11px] font-bold text-white shadow-md">
                          Recommended
                        </div>
                      )}
                      <button
                        onClick={() => setFormData((p) => ({ ...p, dailyGoal: goal }))}
                        className={`flex h-[62px] w-full items-center justify-between rounded-2xl px-6 transition-all duration-300 ${
                          isSelected
                            ? "bg-[#dde4ee] shadow-[inset_6px_6px_12px_#c2ccda,inset_-6px_-6px_12px_#ffffff] ring-2 ring-blue-400/60"
                            : "bg-[#dde4ee] shadow-[5px_5px_12px_#c2ccda,-5px_-5px_12px_#ffffff] hover:shadow-[3px_3px_8px_#c2ccda,-3px_-3px_8px_#ffffff] active:scale-[0.98]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`size-2.5 rounded-full transition-all duration-300 ${ isSelected ? "bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]" : "bg-slate-300" }`} />
                          <span className={`text-lg font-bold ${ isSelected ? "text-blue-600" : "text-slate-700" }`}>
                            {goal} ml
                          </span>
                        </div>
                        <div
                          className={`flex size-6 items-center justify-center rounded-full transition-all duration-300 ${
                            isSelected
                              ? "bg-blue-500 shadow-sm"
                              : "bg-[#dde4ee] shadow-[inset_3px_3px_6px_#c2ccda,inset_-3px_-3px_6px_#ffffff]"
                          }`}
                        >
                          {isSelected && <Check className="size-3.5 text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    </div>
                  )
                })}

                {/* Custom Input */}
                <div className="relative mt-2">
                  {recommendedOption === "custom" && (
                    <div className="absolute -top-6 left-4 z-10 rounded-[20px] bg-[#2563eb] px-[10px] py-[3px] text-[11px] font-bold text-white shadow-md">
                      Recommended
                    </div>
                  )}
                  <input
                    type="number"
                    placeholder="Custom goal (ml)..."
                    value={DAILY_GOAL_OPTIONS.includes(formData.dailyGoal as any) ? "" : formData.dailyGoal || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, dailyGoal: Number(e.target.value) || 0 }))}
                    className="h-14 w-full appearance-none rounded-2xl bg-[#dde4ee] px-6 text-center text-base font-bold text-slate-900 shadow-[inset_4px_4px_8px_#c2ccda,inset_-4px_-4px_8px_#ffffff] outline-none transition-all placeholder:text-slate-400 focus:shadow-[inset_5px_5px_10px_#c2ccda,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_rgba(59,130,246,0.25)]"
                  />
                </div>
              </div>
            </div>

            <div className="pb-4 pt-6">
              <button
                onClick={handleNext}
                className="mx-auto flex h-[58px] w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:shadow-xl active:scale-[0.98]"
              >
                Let&apos;s Hydrate <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

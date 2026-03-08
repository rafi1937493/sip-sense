"use client"

import { Home, BarChart3, Settings, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  currentPath?: string
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/statistics", icon: BarChart3, label: "Statistics" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav({ currentPath = "/" }: BottomNavProps) {
  return (
    <nav className="safe-area-bottom fixed inset-x-0 bottom-0 z-50" aria-label="Primary navigation">
      <div className="mx-auto max-w-[420px] px-4 pb-4">
        <div className="bg-background/95 border-border/70 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/85 flex items-center justify-around rounded-2xl p-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn("h-auto min-h-12 flex-col gap-1 rounded-xl px-4 py-2.5 transition-all duration-200", isActive && "text-primary")}
              >
                <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                  <item.icon className="size-4" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

interface FloatingAddButtonProps {
  onClick: () => void
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <Button
      size="icon-lg"
      className="fixed bottom-24 left-1/2 z-40 size-14 -translate-x-1/2 rounded-full shadow-xl hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 transition-all duration-200"
      onClick={onClick}
      aria-label="Add drink"
    >
      <Plus className="size-5" />
    </Button>
  )
}

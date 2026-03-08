"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { DrinkLogEntry } from "@/types"
import { DRINK_EMOJIS } from "./drink-card"

interface DrinkHistoryListProps {
  logs: DrinkLogEntry[]
  onDelete: (id: string) => void
  onEdit: (log: DrinkLogEntry) => void
}

export function DrinkHistoryList({ logs, onDelete, onEdit }: DrinkHistoryListProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white overflow-hidden border-2 border-dashed border-slate-200/60" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
        <div className="flex flex-col items-center justify-center py-32 text-center px-10 gap-5">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-100/40 blur-2xl rounded-full scale-110" />
            <span className="relative text-5xl leading-none select-none">💧</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-slate-700">No drinks logged yet</p>
            <p className="text-[13px] font-normal text-[#9ca3af] tracking-tight">Add your first drink to start tracking hydration.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3.5" role="list" aria-label="Drink history">
      {logs.map((log) => (
        <DrinkHistoryItem key={log.id} log={log} onDelete={() => onDelete(log.id)} onEdit={() => onEdit(log)} />
      ))}
    </div>
  )
}

interface DrinkHistoryItemProps {
  log: DrinkLogEntry
  onDelete: () => void
  onEdit: () => void
}

function DrinkHistoryItem({ log, onDelete, onEdit }: DrinkHistoryItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(), 150)
  }

  return (
    <Card className={isDeleting ? "surface-card translate-x-4 opacity-0 transition-all" : "surface-card transition-all"} role="listitem">
      <CardContent className="flex items-center gap-3 py-4">
        <div className="bg-primary/10 flex size-11 items-center justify-center rounded-xl text-lg">
          {log.icon || DRINK_EMOJIS[log.drinkType] || "💧"}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-sm font-semibold">{log.drinkType}</p>
          <p className="text-muted-foreground text-xs">
            {log.quantityMl}ml to {Math.round(log.hydrationAmount)}ml hydration
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="size-9 hover:bg-primary/10 hover:text-primary transition-colors" onClick={onEdit} aria-label={`Edit ${log.drinkType}`}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="size-9 hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={handleDelete} aria-label={`Delete ${log.drinkType}`}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"

interface WeeklyData {
  day: string
  date: string
  total: number
  goal: number
}

interface WeeklyChartProps {
  data: WeeklyData[]
  goal: number
}

export function WeeklyChart({ data, goal }: WeeklyChartProps) {
  const chartData = data.map((d) => ({
    name: d.day,
    ml: d.total,
    goal: d.goal,
    percentage: Math.min((d.total / d.goal) * 100, 100),
  }))

  const average = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.total, 0) / data.length) : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Weekly average</p>
          <p className="text-2xl font-semibold">{average} ml</p>
        </div>
        <Badge variant="secondary">Goal: {goal} ml</Badge>
      </div>

      <div className="h-64" role="img" aria-label="Bar chart of hydration totals for the last seven days">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null
                const point = payload[0].payload
                return (
                  <div className="bg-background rounded-md border p-2 text-xs shadow-sm">
                    <p className="font-medium">{point.name}</p>
                    <p>{point.ml} ml</p>
                    <p className="text-muted-foreground">{Math.round(point.percentage)}%</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="ml" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.percentage >= 100 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

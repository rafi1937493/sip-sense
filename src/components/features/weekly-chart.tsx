"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts"

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
  // Always show Mon → Sun in fixed order
  const DOW_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Map incoming data by day label, fill missing days with 0
  const byDay: Record<string, number> = {}
  data.forEach((d, i) => { byDay[d.day] = d.total })

  // Today = last entry in data
  const todayLabel = data.length > 0 ? data[data.length - 1].day : ""

  const chartData = DOW_ORDER.map((day) => ({
    name: day,
    ml: byDay[day] ?? 0,
    isToday: day === todayLabel,
    percentage: Math.min(((byDay[day] ?? 0) / goal) * 100, 100),
  }))

  const maxVal = Math.max(...chartData.map((d) => d.ml), goal * 1.2)

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="h-[2px] w-5 border-t-2 border-dashed border-blue-400" />
          <span className="text-[11px] text-slate-400 font-medium">Goal ({goal} ml)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "linear-gradient(to top, #3b82f6, #93c5fd)" }} />
          <span className="text-[11px] text-slate-400 font-medium">Other days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "linear-gradient(to top, #1d4ed8, #60a5fa)" }} />
          <span className="text-[11px] text-slate-400 font-medium">Today</span>
        </div>
      </div>

      <div className="h-48" role="img" aria-label="Bar chart of hydration totals for the week">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%" margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
            <defs>
              <linearGradient id="barNorm" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
              <linearGradient id="barToday" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={0}
              padding={{ left: 10, right: 10 }}
              tick={({ x, y, payload }) => {
                const isToday = payload.value === todayLabel
                return (
                  <text
                    x={x} y={Number(y) + 10}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={isToday ? 700 : 500}
                    fill={isToday ? "#3b82f6" : "#94a3b8"}
                  >
                    {payload.value}
                  </text>
                )
              }}
            />
            <YAxis hide domain={[0, maxVal]} width={0} />

            {/* Dashed goal line */}
            <ReferenceLine
              y={goal} stroke="#93c5fd"
              strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.8}
            />

            {/* Tooltip shown only on hover — Recharts default behavior */}
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null
                const p = payload[0].payload
                if (p.ml === 0) return null
                return (
                  <div className="rounded-xl bg-white px-3 py-2 text-xs shadow-lg border border-slate-100">
                    <p className="font-bold text-slate-700">{p.name}</p>
                    <p className="text-blue-600 font-semibold">{p.ml} ml</p>
                    <p className="text-slate-400">{Math.round(p.percentage)}% of goal</p>
                  </div>
                )
              }}
            />

            <Bar dataKey="ml" radius={[8, 8, 3, 3]} barSize={28}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? "url(#barToday)" : entry.ml > 0 ? "url(#barNorm)" : "rgba(203,213,225,0.6)"}
                  opacity={entry.isToday ? 1 : 0.78}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

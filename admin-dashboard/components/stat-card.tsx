"use client"

import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  change: string
  icon: LucideIcon
  trend: "up" | "down"
  color: "green" | "blue" | "red" | "purple"
}

const colorClasses = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
}

export default function StatCard({ label, value, change, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-3">
            {trend === "up" ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span
              className={trend === "up" ? "text-green-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}
            >
              {change}
            </span>
          </div>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}

"use client"

import { TrendingUp, Package, ShoppingCart, AlertCircle } from "lucide-react"
import StatCard from "../stat-card"
import RecentActivity from "../recent-activity"
import TopProducts from "../top-products"
import { useTheme } from "../admin-dashboard"

interface OverviewProps {
  stats?: {
    totalItems?: { value: string; change: string }
    totalOrders?: { value: string; change: string }
    outOfStock?: { value: string; change: string }
    revenue?: { value: string; change: string }
  }
  recentActivities?: Array<{
    id: number
    action: string
    description: string
    time: string
  }>
  topProducts?: Array<{
    id: number
    name: string
    sales: number
  }>
}

export default function Overview({ stats, recentActivities, topProducts }: OverviewProps) {
  const { isDarkMode, t } = useTheme()
  // </CHANGE>

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{t("overview")}</h1>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          Welcome back! Here's what's happening with your store today.
        </p>
        {/* </CHANGE> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t("totalItems")}
          value={stats?.totalItems?.value || "0"}
          change={stats?.totalItems?.change || "+0%"}
          icon={Package}
          trend="up"
          color="green"
        />
        <StatCard
          label={t("totalOrders")}
          value={stats?.totalOrders?.value || "0"}
          change={stats?.totalOrders?.change || "+0%"}
          icon={ShoppingCart}
          trend="up"
          color="blue"
        />
        <StatCard
          label={t("outOfStock")}
          value={stats?.outOfStock?.value || "0"}
          change={stats?.outOfStock?.change || "0"}
          icon={AlertCircle}
          trend="down"
          color="red"
        />
        <StatCard
          label={t("revenue")}
          value={stats?.revenue?.value || "$0"}
          change={stats?.revenue?.change || "+0%"}
          icon={TrendingUp}
          trend="up"
          color="purple"
        />
        {/* </CHANGE> */}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
        <div>
          <TopProducts products={topProducts} />
        </div>
      </div>
    </div>
  )
}

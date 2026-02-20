"use client"

import { BarChart3, Package, Grid3x3, ShoppingCart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "./admin-dashboard"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
  isOpen: boolean
}

const colorMap = {
  green: {
    gradient: "from-green-600 to-green-700",
    border: "border-green-500",
    bg: "bg-green-600",
    text: "text-green-600",
    activeLight: "bg-white text-green-600",
    hoverLight: "hover:bg-green-500",
    lightText: "text-green-100",
    lightBg: "bg-green-500",
  },
  blue: {
    gradient: "from-blue-600 to-blue-700",
    border: "border-blue-500",
    bg: "bg-blue-600",
    text: "text-blue-600",
    activeLight: "bg-white text-blue-600",
    hoverLight: "hover:bg-blue-500",
    lightText: "text-blue-100",
    lightBg: "bg-blue-500",
  },
  red: {
    gradient: "from-red-600 to-red-700",
    border: "border-red-500",
    bg: "bg-red-600",
    text: "text-red-600",
    activeLight: "bg-white text-red-600",
    hoverLight: "hover:bg-red-500",
    lightText: "text-red-100",
    lightBg: "bg-red-500",
  },
  orange: {
    gradient: "from-orange-600 to-orange-700",
    border: "border-orange-500",
    bg: "bg-orange-600",
    text: "text-orange-600",
    activeLight: "bg-white text-orange-600",
    hoverLight: "hover:bg-orange-500",
    lightText: "text-orange-100",
    lightBg: "bg-orange-500",
  },
}

export default function Sidebar({ activeTab, setActiveTab, isOpen }: SidebarProps) {
  const { isDarkMode, accentColor, t } = useTheme()
  const colors = colorMap[accentColor as keyof typeof colorMap] || colorMap.green

  const menuItems = [
    { id: "overview", label: t("overview"), icon: BarChart3 },
    { id: "products", label: t("products"), icon: Package },
    { id: "collections", label: t("collections"), icon: Grid3x3 },
    { id: "orders", label: t("orders"), icon: ShoppingCart },
    { id: "settings", label: t("settings"), icon: Settings },
  ]

  return (
    <div
      className={cn(
        "w-64 text-white transition-all duration-300 ease-in-out",
        isDarkMode ? "bg-gradient-to-b from-gray-800 to-gray-900" : `bg-gradient-to-b ${colors.gradient}`,
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className={cn("p-6 border-b", isDarkMode ? "border-gray-700" : colors.border)}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg",
              isDarkMode ? `${colors.bg} text-white` : `bg-white ${colors.text}`,
            )}
          >
            EZ
          </div>
          <div>
            <h1 className="font-bold text-lg">{t("electrozone")}</h1>
            <p className={cn("text-xs", isDarkMode ? "text-gray-400" : colors.lightText)}>{t("admin")}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                activeTab === item.id
                  ? isDarkMode
                    ? `${colors.bg} text-white font-semibold`
                    : `${colors.activeLight} font-semibold`
                  : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : `${colors.lightText} ${colors.hoverLight} hover:text-white`,
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div
        className={cn(
          "absolute bottom-6 left-4 right-4 rounded-lg p-4 text-sm",
          isDarkMode ? "bg-gray-700" : colors.lightBg,
        )}
      >
        <p className="font-semibold mb-2">{t("needHelp")}</p>
        <p className={cn("text-xs", isDarkMode ? "text-gray-300" : colors.lightText)}>{t("helpText")}</p>
      </div>
    </div>
  )
}

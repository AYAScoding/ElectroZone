"use client"

import { Menu, Bell, Moon, Sun, Languages, Palette } from "lucide-react"
import { useTheme } from "./admin-dashboard"
import { useState } from "react"
import type { Language } from "@/lib/translations"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
}

const colorMap = {
  green: {
    hover: "hover:text-green-600",
    hoverDark: "hover:text-green-500",
    gradient: "from-green-400 to-green-600",
    active: "bg-green-600",
    activeLight: "bg-green-50 text-green-700",
  },
  blue: {
    hover: "hover:text-blue-600",
    hoverDark: "hover:text-blue-500",
    gradient: "from-blue-400 to-blue-600",
    active: "bg-blue-600",
    activeLight: "bg-blue-50 text-blue-700",
  },
  red: {
    hover: "hover:text-red-600",
    hoverDark: "hover:text-red-500",
    gradient: "from-red-400 to-red-600",
    active: "bg-red-600",
    activeLight: "bg-red-50 text-red-700",
  },
  orange: {
    hover: "hover:text-orange-600",
    hoverDark: "hover:text-orange-500",
    gradient: "from-orange-400 to-orange-600",
    active: "bg-orange-600",
    activeLight: "bg-orange-50 text-orange-700",
  },
}

export default function Header({ setSidebarOpen, sidebarOpen }: HeaderProps) {
  const { isDarkMode, toggleDarkMode, language, setLanguage, accentColor, setAccentColor } = useTheme()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showColorMenu, setShowColorMenu] = useState(false)

  const colors = colorMap[accentColor as keyof typeof colorMap] || colorMap.green

  const languages = [
    { code: "en" as Language, name: "English" },
    { code: "fr" as Language, name: "Français" },
    { code: "tr" as Language, name: "Türkçe" },
    { code: "fa" as Language, name: "فارسی" },
    { code: "ru" as Language, name: "Русский" },
    { code: "ar" as Language, name: "العربية" },
  ]

  const colorOptions = [
    { name: "green", bg: "bg-green-600", hover: "hover:bg-green-700", ring: "ring-green-500" },
    { name: "blue", bg: "bg-blue-600", hover: "hover:bg-blue-700", ring: "ring-blue-500" },
    { name: "red", bg: "bg-red-600", hover: "hover:bg-red-700", ring: "ring-red-500" },
    { name: "orange", bg: "bg-orange-600", hover: "hover:bg-orange-700", ring: "ring-orange-500" },
  ]

  const handleLanguageChange = (lang: { code: Language; name: string }) => {
    setLanguage(lang.code)
    setShowLanguageMenu(false)
    console.log("[v0] Language changed to:", lang.name, "Code:", lang.code)
  }

  const handleColorChange = (colorName: string) => {
    setAccentColor(colorName)
    setShowColorMenu(false)
    console.log("[v0] Accent color changed to:", colorName)
  }

  const currentLanguageName = languages.find((lang) => lang.code === language)?.name || "English"
  const currentColor = colorOptions.find((c) => c.name === accentColor) || colorOptions[0]

  return (
    <div
      className={`border-b px-6 py-4 flex items-center justify-between ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`md:hidden transition-colors ${isDarkMode ? `text-gray-300 ${colors.hoverDark}` : `text-gray-600 ${colors.hover}`}`}
      >
        <Menu size={24} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <a
          href="http://localhost:3000"
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors border ${isDarkMode
            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
        >
          Back to Store
        </a>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${isDarkMode
            ? "text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowColorMenu(!showColorMenu)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            title="Change Accent Color"
          >
            <Palette size={20} />
          </button>

          {showColorMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowColorMenu(false)} />

              <div
                className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
              >
                <div className={`text-xs font-semibold mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Accent Color
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorChange(color.name)}
                      className={`w-12 h-12 ${color.bg} rounded-lg transition-all ${color.hover} ${accentColor === color.name
                        ? `ring-2 ring-offset-2 ${isDarkMode ? "ring-offset-gray-800" : "ring-offset-white"} ${color.ring}`
                        : ""
                        }`}
                      title={color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                    />
                  ))}
                </div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-3 text-center`}>
                  <span className="capitalize font-medium">{accentColor}</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
              }`}
            title="Change Language"
          >
            <Languages size={20} />
            <span className="text-sm font-medium hidden sm:inline">{currentLanguageName}</span>
          </button>

          {showLanguageMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />

              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
              >
                <div
                  className={`px-3 py-2 border-b text-xs font-semibold ${isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}
                >
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between last:rounded-b-lg ${language === lang.code
                      ? isDarkMode
                        ? `${colors.active} text-white font-medium`
                        : `${colors.activeLight} font-medium`
                      : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span>{lang.name}</span>
                    {language === lang.code && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          className={`relative p-2 transition-colors ${isDarkMode ? `text-gray-300 ${colors.hoverDark}` : `text-gray-600 ${colors.hover}`}`}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <div
            className={`w-8 h-8 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center text-white text-sm font-bold`}
          >
            A
          </div>
          <span className="text-sm font-medium">Admin</span>
        </button>
      </div>
    </div>
  )
}

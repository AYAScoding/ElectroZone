"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Sun, Moon, Globe, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/use-translation"
import type { Language } from "@/lib/translations"

export function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { t, language, changeLanguage, mounted } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [accentColor, setAccentColor] = useState("green")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light"
      const savedColor = localStorage.getItem("accentColor") || "green"

      setTheme(savedTheme)
      setAccentColor(savedColor)

      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      document.documentElement.setAttribute("data-accent-color", savedColor)

      console.log("[v0] Header initialized - Theme:", savedTheme, "Color:", savedColor, "Language:", language)
    }
  }, [language])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleLanguageChange = (value: string) => {
    console.log("[v0] Language dropdown clicked:", value)
    changeLanguage(value as Language)
  }

  const handleColorChange = (value: string) => {
    console.log("[v0] Color changed to:", value)
    setAccentColor(value)
    localStorage.setItem("accentColor", value)
    document.documentElement.setAttribute("data-accent-color", value)
  }

  const languageOptions = {
    en: "English",
    es: "Español",
    fr: "Français",
    tr: "Türkçe",
    ru: "Русский",
    fa: "فارسی",
    ar: "العربية",
  }

  const colorOptions = [
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
              <span className="text-xl font-bold text-primary-foreground">EZ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">ElectroZone</span>
              <span className="text-xs text-muted-foreground leading-tight">{t("yourTechDestination")}</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  title={languageOptions[language as keyof typeof languageOptions]}
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(languageOptions).map(([code, name]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={language === code ? "bg-accent" : ""}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {colorOptions.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={accentColor === color.value ? "bg-accent" : ""}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${color.class}`} />
                      <span>{color.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.role === 'admin' && (
                      <Badge variant="outline" className="mt-1 text-xs">Admin</Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <a href="http://localhost:3001" className="font-semibold text-primary">Admin Dashboard</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t("dashboard")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders">{t("orders")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>{t("logout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center gap-6 overflow-x-auto text-sm">
            <Link href="/products?category=Smartphones" className="whitespace-nowrap hover:text-primary">
              {t("smartphones")}
            </Link>
            <Link href="/products?category=Laptops" className="whitespace-nowrap hover:text-primary">
              {t("laptops")}
            </Link>
            <Link href="/products?category=Tablets" className="whitespace-nowrap hover:text-primary">
              {t("tablets")}
            </Link>
            <Link href="/products?category=Audio" className="whitespace-nowrap hover:text-primary">
              {t("audio")}
            </Link>
            <Link href="/products?category=Wearables" className="whitespace-nowrap hover:text-primary">
              {t("wearables")}
            </Link>
            <Link href="/products?category=Smart Home" className="whitespace-nowrap hover:text-primary">
              {t("smartHome")}
            </Link>
            <Link href="/products?category=Accessories" className="whitespace-nowrap hover:text-primary">
              {t("accessories")}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

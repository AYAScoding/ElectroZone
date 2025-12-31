"use client"

import { useState, useEffect } from "react"
import { type Language, type TranslationKey, getTranslation } from "@/lib/translations"

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedLanguage = (localStorage.getItem("language") as Language) || "en"
      setLanguage(savedLanguage)
      console.log("[v0] Loaded language:", savedLanguage)
    }
  }, [])

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key)
  }

  const changeLanguage = (newLang: Language) => {
    console.log("[v0] Changing language to:", newLang)
    setLanguage(newLang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang)
    }
    // Force page reload to apply translations everywhere
    window.location.reload()
  }

  return { t, language, changeLanguage, mounted }
}

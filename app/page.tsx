"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  CreditCard,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Package,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "@/hooks/use-translation"

const displayCategories = [
  { name: "smartphones" },
  { name: "laptops" },
  { name: "tablets" },
  { name: "audio" },
  { name: "wearables" },
  { name: "smartHome" },
]

const categoryIcons = {
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Package,
  audio: Headphones,
  wearables: Watch,
  smartHome: Home,
}

export default function HomePage() {
  const [showMain, setShowMain] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColor = localStorage.getItem("accentColor") || "green"
      document.documentElement.setAttribute("data-accent-color", savedColor)
    }
  }, [])

  if (!showMain) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
        <div className="text-center space-y-8 max-w-3xl">
          <button
            onClick={() => setShowMain(true)}
            className="mx-auto block transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-bold text-primary-foreground">EZ</span>
            </div>
          </button>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("welcomeTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance">{t("tagline")}</p>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">{t("welcomeDescription")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setShowMain(true)} className="text-lg px-8">
              {t("exploreNow")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
              <Link href="/products">{t("shopProducts")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{t("fastDelivery")}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{t("securePayment")}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{t("freeShipping")}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{t("easyReturns")}</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground pt-4">{t("clickToEnter")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                  {t("heroTitle")}
                </h1>
                <p className="text-lg text-muted-foreground text-pretty">{t("heroDescription")}</p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/products">
                      {t("shopNow")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/products?filter=deals">{t("viewDeals")}</Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
                <Image
                  src="/modern-electronic-devices-showcase.jpg"
                  alt="Latest tech devices"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-balance">{t("shopByCategory")}</h2>
              <p className="text-muted-foreground mt-2">{t("findWhat")}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {displayCategories.map((category) => {
                const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || Package
                return (
                  <Link key={category.name} href={`/products?category=${category.name}`}>
                    <Card className="group transition-all hover:shadow-lg hover:border-primary">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold">{t(category.name as any)}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Placeholder for products sections */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{t("featuredProducts")}</h2>
            <p className="text-muted-foreground mb-8">{t("connectBackend")}</p>
            <Button asChild>
              <Link href="/products">{t("browseAll")}</Link>
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden bg-gradient-to-r from-primary to-accent">
              <CardContent className="p-8 md:p-12 text-center text-primary-foreground">
                <h2 className="text-3xl font-bold mb-4 text-balance">{t("firstOrderOff")}</h2>
                <p className="text-lg mb-6 text-primary-foreground/90 text-pretty">{t("newsletterSignup")}</p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">{t("createAccount")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

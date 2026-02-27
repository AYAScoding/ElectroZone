"use client";

import { useState, createContext, useContext } from "react";
import Sidebar from "./sidebar";
import Header from "./admin-header";
import Overview from "./sections/overview";
import ProductManagement from "./sections/product-management";
import Collections from "./sections/collections";
import Orders from "./sections/orders";
import Settings from "./sections/settings";
import Users from "./sections/users";
import { translations, type Language } from "@/lib/translations";

type TabType = "overview" | "products" | "collections" | "orders" | "users" | "settings";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => { },
  accentColor: "green",
  setAccentColor: () => { },
  language: "en",
  setLanguage: () => { },
  t: (key) => key,
});

export const useTheme = () => useContext(ThemeContext);

interface AdminDashboardProps {
  overviewData?: any;
  productsData?: any[];
  categoriesData?: Array<{ id: number; name: string }>;
  collectionsData?: any[];
  ordersData?: any[];
  usersData?: any[];
  onAddProduct?: (product: any) => void;
  onEditProduct?: (id: number) => void;
  onDeleteProduct?: (id: number) => void;
  onAddCollection?: () => void;
  onEditCollection?: (id: number) => void;
  onDeleteCollection?: (id: number) => void;
  onViewOrder?: (id: string) => void;
  onOrderStatusUpdate?: (id: string, newStatus: string) => void;
}

export default function AdminDashboard({
  overviewData,
  productsData,
  categoriesData,
  collectionsData,
  ordersData,
  usersData,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
  onViewOrder,
  onUpdateUserRole,
  onDeleteUser,
  onOrderStatusUpdate,
}: AdminDashboardProps & {
  onUpdateUserRole?: (id: string, role: "customer" | "admin") => void,
  onDeleteUser?: (id: string) => void
}) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("green");
  const [language, setLanguage] = useState<Language>("en");

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const t = (key: keyof typeof translations.en): string =>
    translations[language][key] || key;

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            stats={overviewData?.stats}
            recentActivities={overviewData?.recentActivities}
            topProducts={overviewData?.topProducts}
          />
        );
      case "products":
        return (
          <ProductManagement
            products={productsData}
            categories={categoriesData}
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      case "collections":
        return (
          <Collections
            collections={collectionsData}
            onAddCollection={onAddCollection}
            onEditCollection={onEditCollection}
            onDeleteCollection={onDeleteCollection}
          />
        );
      case "orders":
        return <Orders orders={ordersData} onViewOrder={onViewOrder} onStatusUpdate={onOrderStatusUpdate} />;
      case "users":
        return <Users users={usersData} onUpdateRole={onUpdateUserRole!} onDeleteUser={onDeleteUser!} />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Overview
            stats={overviewData?.stats}
            recentActivities={overviewData?.recentActivities}
            topProducts={overviewData?.topProducts}
          />
        );
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        accentColor,
        setAccentColor,
        language,
        setLanguage,
        t,
      }}
    >
      <div
        className={`flex h-screen ${isDarkMode ? "dark bg-background text-foreground" : "bg-gray-50"}`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8">{renderContent()}</div>
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

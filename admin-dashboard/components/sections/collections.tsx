"use client"

import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "../admin-dashboard"

interface Collection {
  id: number
  name: string
  items: number
  featured: boolean
}

interface CollectionsProps {
  collections?: Collection[]
  onAddCollection?: () => void
  onEditCollection?: (id: number) => void
  onDeleteCollection?: (id: number) => void
}

export default function Collections({
  collections = [],
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
}: CollectionsProps) {
  const { isDarkMode, t } = useTheme()
  // </CHANGE>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {t("manageCollections")}
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Organize products into categories and featured collections
          </p>
          {/* </CHANGE> */}
        </div>
        <Button onClick={onAddCollection} className="bg-green-600 hover:bg-green-700 text-white gap-2">
          <Plus size={18} />
          {t("addCollection")}
          {/* </CHANGE> */}
        </Button>
      </div>

      {collections.length === 0 ? (
        <div
          className={`rounded-lg border p-12 text-center ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>{t("noCollections")}</p>
          {/* </CHANGE> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`rounded-lg border p-6 hover:shadow-lg transition-shadow ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {collection.name}
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {collection.items} {t("items")}
                  </p>
                  {/* </CHANGE> */}
                </div>
                {collection.featured && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {t("featured")}
                    {/* </CHANGE> */}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEditCollection?.(collection.id)}
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  size="sm"
                >
                  <Edit2 size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => onDeleteCollection?.(collection.id)}
                  variant="outline"
                  className="flex-1 gap-2 text-red-600 hover:text-red-700 bg-transparent"
                  size="sm"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

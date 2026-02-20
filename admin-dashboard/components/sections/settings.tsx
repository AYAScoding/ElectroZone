"use client"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "../admin-dashboard"

export default function Settings() {
  const { isDarkMode } = useTheme()

  const handleSave = () => {
    console.log("[v0] Saving settings")
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Settings</h1>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage your store configuration and preferences
        </p>
      </div>

      {/* Store Settings */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border p-6`}
      >
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>Store Information</h2>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
              Store Name
            </label>
            <Input
              placeholder="ElectroZone"
              defaultValue="ElectroZone"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
              Store Email
            </label>
            <Input
              type="email"
              placeholder="admin@electrozone.com"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
              Store Description
            </label>
            <textarea
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
              }`}
              rows={4}
              placeholder="Describe your store..."
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border p-6`}
      >
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>Security</h2>
        <div className="space-y-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Change Password</Button>
          <Button
            variant="outline"
            className={`w-full ${isDarkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : "bg-transparent"}`}
          >
            Two-Factor Authentication
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8">
          <Save size={18} />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

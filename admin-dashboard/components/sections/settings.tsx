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
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store configuration and preferences
        </p>
      </div>

      {/* Store Settings */}
      <div
        className="bg-card rounded-lg border border-border p-6"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">Store Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Store Name
            </label>
            <Input
              placeholder="ElectroZone"
              defaultValue="ElectroZone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Store Email
            </label>
            <Input
              type="email"
              placeholder="admin@electrozone.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Store Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent text-foreground placeholder:text-muted-foreground"
              rows={4}
              placeholder="Describe your store..."
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div
        className="bg-card rounded-lg border border-border p-6"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">Security</h2>
        <div className="space-y-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full">Change Password</Button>
          <Button
            variant="outline"
            className="w-full"
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

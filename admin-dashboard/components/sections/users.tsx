"use client"

import { useState } from "react"
import { Search, MoreVertical, Shield, User as UserIcon } from "lucide-react"
import { useTheme } from "../admin-dashboard"
import { UserDto } from "@/lib/user-api"
import { Badge } from "@/components/ui/badge"

interface UsersProps {
    users: UserDto[] | undefined
    onUpdateRole: (id: string, newRole: "customer" | "admin") => void
}

export default function Users({ users = [], onUpdateRole }: UsersProps) {
    const { isDarkMode, accentColor, t } = useTheme()
    const [searchTerm, setSearchTerm] = useState("")

    const getAccentClass = () => {
        switch (accentColor) {
            case "blue": return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
            case "red": return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
            case "orange": return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300"
            default: return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
        }
    }

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Users
                    </h2>
                    <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                        Manage and view all registered users.
                    </p>
                </div>
            </div>

            <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className={`p-4 border-b flex flex-col sm:flex-row justify-between gap-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="relative w-full sm:w-64">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 ${isDarkMode
                                    ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                                }`}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={isDarkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50/50 text-gray-500"}>
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className={`transition-colors ${isDarkMode ? "hover:bg-gray-750/50" : "hover:bg-gray-50"}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? getAccentClass() : isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.name}</div>
                                                    <div className={isDarkMode ? "text-gray-400" : "text-gray-500"}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                                {user.role === 'admin' ? 'Admin' : 'Customer'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role === 'admin' ? (
                                                <button
                                                    onClick={() => onUpdateRole(user._id, "customer")}
                                                    className="text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    Demote
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onUpdateRole(user._id, "admin")}
                                                    className="text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

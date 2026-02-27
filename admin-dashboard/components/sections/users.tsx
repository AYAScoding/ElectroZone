"use client"

import { useState } from "react"
import { Search, Shield, User as UserIcon } from "lucide-react"
import { useTheme } from "../admin-dashboard"
import { UserDto } from "@/lib/user-api"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UsersProps {
    users: UserDto[] | undefined
    onUpdateRole: (id: string, newRole: "customer" | "admin") => void
    onDeleteUser: (id: string) => void
}

export default function Users({ users = [], onUpdateRole, onDeleteUser }: UsersProps) {
    const { isDarkMode, accentColor, t } = useTheme()
    const [searchTerm, setSearchTerm] = useState("")
    const [userToDelete, setUserToDelete] = useState<string | null>(null)

    const getAccentClass = () => {
        switch (accentColor) {
            case "blue": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
            case "red": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300"
            case "orange": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
            default: return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
        }
    }

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const admins = filteredUsers.filter(u => u.role === "admin")
    const customers = filteredUsers.filter(u => u.role === "customer")

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete)
            setUserToDelete(null)
        }
    }

    const renderUserTable = (title: string, data: UserDto[]) => (
        <div className="mt-8 rounded-xl shadow-sm border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{title} ({data.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                    No {title.toLowerCase()} found
                                </td>
                            </tr>
                        ) : (
                            data.map((user) => (
                                <tr key={user._id} className="transition-colors hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`min-w-10 w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? getAccentClass() : "bg-muted text-muted-foreground"
                                                }`}>
                                                {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                                            </div>
                                            <div className="truncate w-full max-w-[200px]">
                                                <div className="font-medium truncate text-foreground">{user.name}</div>
                                                <div className="truncate text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                            {user.role === 'admin' ? 'Admin' : 'Customer'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2 text-right">
                                            {user.role === 'admin' ? (
                                                <button
                                                    onClick={() => onUpdateRole(user._id, "customer")}
                                                    className="text-xs font-medium text-orange-500 hover:text-orange-600 border border-orange-200 hover:bg-orange-500/10 dark:border-orange-900/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    Demote
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onUpdateRole(user._id, "admin")}
                                                    className="text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 hover:bg-green-500/10 dark:border-green-900/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setUserToDelete(user._id)}
                                                className="text-xs font-medium text-red-600 hover:text-red-700 border border-transparent hover:border-red-200 hover:bg-red-500/10 dark:hover:border-red-900/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                            >
                                                Block/Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
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

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-input/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 transition-shadow`}
                    />
                </div>
            </div>

            {renderUserTable("Administrators", admins)}
            {renderUserTable("Customers", customers)}

            <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account
                            and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

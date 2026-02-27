/* ===============================
   User API Client
================================ */

const USER_API_URL = process.env.NEXT_PUBLIC_USER_API || "http://localhost:5001/api/users";

function getToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("admin-token");
    }
    return null;
}

export type UserDto = {
    _id: string;
    name: string;
    email: string;
    role: "customer" | "admin";
    createdAt: string;
};

export async function getAllUsers(): Promise<UserDto[]> {
    const token = getToken();
    if (!token) throw new Error("No admin token found. Please login.");

    const res = await fetch(`${USER_API_URL}/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GET /users failed: ${res.status} - ${errorText}`);
    }

    return res.json();
}

export async function updateUserRole(id: string, role: "customer" | "admin"): Promise<UserDto> {
    const token = getToken();
    if (!token) throw new Error("No admin token found. Please login.");

    const res = await fetch(`${USER_API_URL}/${id}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role })
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`PATCH /users/${id}/role failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data.user;
}

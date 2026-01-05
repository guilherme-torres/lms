type UserRole = "admin" | "editor" | "user"

export type UserData = {
    id: number
    name: string
    username: string
    email: string
    role: UserRole
    passwordHash: string
    created: string
    updated: string
}

export type CreateUserData =
    Omit<UserData, "id" | "created" | "updated">
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

export type SessionData = {
    sid_hash: Buffer
    user_id: number
    created: string
    expires: number
    ip: string
    ua: string
    revoked: number // 0 ou 1
}

export type CreateSessionData =
    Omit<SessionData, "created" | "expires" | "revoked">
    & { expires_ms: number }
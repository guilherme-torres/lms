import { Repository } from "../../core/utils/abstract.ts";
import type { CreateSessionData, CreateUserData, SessionData, UserData, UserRole } from "./types.ts";

export class AuthRepository extends Repository {
    createUserDB({ name, username, email, role, passwordHash }: CreateUserData) {
        return this.db.query(`
            INSERT OR IGNORE INTO "users"
            ("name", "username", "email", "role", "password_hash")
            VALUES
            (?, ?, ?, ?, ?)
        `).run(name, username, email, role, passwordHash)
    }

    getUserDB(username: string) {
        return this.db.query(`
            SELECT * FROM "users" WHERE "username" = ?
        `).get(username) as UserData | undefined
    }

    insertSession({ sid_hash, user_id, expires_ms, ip, ua }: CreateSessionData) {
        return this.db.query(`
            INSERT OR IGNORE INTO "sessions"
            ("sid_hash", "user_id", "expires", "ip", "ua")
            VALUES
            (?, ?, ?, ?, ?)
        `).run(sid_hash, user_id, Math.floor(expires_ms / 1000), ip, ua)
    }

    getSession(sidHash: Buffer) {
        return this.db.query(`
            SELECT "s".*, "s"."expires" * 1000 as "expires_ms" FROM "sessions" as "s"
            WHERE "sid_hash" = ?
        `).get(sidHash) as SessionData & { expires_ms: number } | undefined
    }

    revokeSession(key: "sid_hash" | "user_id", sidHash: Buffer) {
        return this.db.query(`
            UPDATE "sessions" SET "revoked" = 1 WHERE ${key} = ?
        `).run(sidHash)
    }

    updateSessionExpires(sidHash: Buffer, expires_ms: number) {
        return this.db.query(`
            UPDATE "sessions" SET "expires" = ? WHERE "sid_hash" = ?
        `).run(Math.floor(expires_ms / 1000), sidHash)
    }

    selectUserRole(id: number) {
        return this.db.query(`
            SELECT "role" FROM "users" WHERE "id" = ?
        `).get(id) as { "role": UserRole } | undefined
    }
}
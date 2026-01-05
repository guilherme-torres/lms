import { Repository } from "../../core/utils/abstract.ts";
import type { CreateUserData, UserData } from "./types.ts";

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
}
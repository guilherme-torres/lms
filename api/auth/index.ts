import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { AuthRepository } from "./repository.ts";
import { SessionService } from "./services/session.ts";
import { authTables } from "./tables.ts";

export class AuthApi extends Api {
    repository = new AuthRepository(this.db)
    sessionService = new SessionService(this.core)

    handlers = {
        createUser: (req, res) => {
            const { name, username, email, password } = req.body
            const passwordHash = password
            const result = this.repository.createUserDB({
                name,
                username,
                email,
                role: "user",
                passwordHash
            })
            if (result.changes === 0) {
                throw new RouteError(400, "erro ao criar usuário")
            }
            res.status(201).json({ title: "usuário criado" })
        },
        login: async (req, res) => {
            const { email, password } = req.body
            const user = this.db.query(`
                SELECT "id", "email", "password_hash" FROM "users"
                WHERE "email" = ?
            `).get(email) as { id: number, email: string, password_hash: string } | undefined
            if (!user || password !== user.password_hash) {
                throw new RouteError(404, "credenciais incorretas")
            }
            console.log(user)
            const { cookie } = await this.sessionService.create({
                userId: user.id,
                ip: req.ip,
                ua: req.headers["user-agent"] ?? ""
            })
            res.setHeader("Set-Cookie", cookie)
            res.status(200).json({ message: "success" })
        }
    } satisfies Api['handlers']

    tables() {
        this.db.exec(authTables)
    }

    routes() {
        this.router.post("/auth/users", this.handlers.createUser)
        this.router.post("/auth/login", this.handlers.login)
    }
}
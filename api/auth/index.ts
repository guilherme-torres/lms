import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { AuthRepository } from "./repository.ts";
import { COOKIE_SID_KEY, SessionService } from "./services/session.ts";
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
            res.setCookie(cookie)
            res.status(200).json({ message: "success" })
        },
        getSession: (req, res) => {
            const sid = req.cookies[COOKIE_SID_KEY]
            if (!sid) {
                throw new RouteError(401, "não autorizado")
            }
            const { valid, cookie, session } = this.sessionService.validate(sid)
            res.setCookie(cookie)
            if (!valid || !session) {
                throw new RouteError(401, "não autorizado")
            }
            res.setHeader("Cache-Control", "private, no-store")
            res.setHeader("Vary", "Cookie")
            res.status(200).json(session)
        }
    } satisfies Api['handlers']

    tables() {
        this.db.exec(authTables)
    }

    routes() {
        this.router.post("/auth/users", this.handlers.createUser)
        this.router.post("/auth/login", this.handlers.login)
        this.router.get("/auth/session", this.handlers.getSession)
    }
}
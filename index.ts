import { readFile } from "node:fs/promises";
import { AuthApi } from "./api/auth/index.ts";
import { LmsApi } from "./api/lms/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/index.ts"
import { RouteError } from "./core/utils/route-error.ts";
import type { SessionData } from "./api/auth/types.ts";
import { sha256Hash } from "./api/auth/utils.ts";

const core = new Core()

core.router.use([logger])

new AuthApi(core).init()
new LmsApi(core).init()

core.router.get("/", async (req, res) => {
    const html = await readFile("./frontend/index.html", "utf-8")
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.status(200).end(html)
})

core.router.get("/seguro", async (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    const sid = cookies["__Secure-sid"]
    if (!sid) {
        throw new RouteError(401, "não autenticado")
    }
    const sidHash = sha256Hash(sid)
    const session = core.db.query(`
        SELECT * FROM "sessions"
        WHERE "sid_hash" = ?
    `).get(sidHash) as SessionData | undefined
    if (!session) {
        throw new RouteError(401, "não autenticado")
    }
    if (Math.floor(Date.now() / 1000) > session.expires) {
        throw new RouteError(401, "sessão expirada")
    }
    const user = core.db.query(`
        SELECT "email", "name" FROM "users"
        WHERE "id" = ?
    `).get(session.user_id)
    if (!user) {
        throw new RouteError(401, "não autenticado")
    }
    res.setHeader("Set-Cookie", "theme=dark; Path=/")
    res.setHeader("Set-Cookie", "cookieVazio=; Path=/")
    res.setHeader("Set-Cookie", "teste=2=1+1; Path=/")
    res.status(200).json(user)
})

core.init()
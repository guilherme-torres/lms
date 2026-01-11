import type { Middleware } from "../../../core/router.ts";
import { CoreProvider } from "../../../core/utils/abstract.ts";
import { RouteError } from "../../../core/utils/route-error.ts";
import { COOKIE_SID_KEY, SessionService } from "../services/session.ts";
import type { UserRole } from "../types.ts";

function roleCheck(requiredRole: UserRole, userRole: UserRole): boolean {
    switch (userRole) {
        case "admin":
            return true
        case "editor":
            return requiredRole === "editor" || requiredRole === "user"
        case "user":
            return requiredRole === "user"
        default:
            return false
    }
}

export class AuthMiddleware extends CoreProvider {
    sessionService = new SessionService(this.core)
    guard = (role: UserRole): Middleware => async (req, res) => {
        res.setHeader("Cache-Control", "private, no-store")
        res.setHeader("Vary", "Cookie")
        const sid = req.cookies[COOKIE_SID_KEY]
        if (!sid) throw new RouteError(401, "não autorizado")
        const { valid, cookie, session } = this.sessionService.validate(sid)
        res.setCookie(cookie)
        if (!valid || !session) throw new RouteError(401, "não autorizado")
        if (!roleCheck(role, session.role)) {
            throw new RouteError(403, "acesso negado")
        }
        req.session = session
    }
    optional: Middleware = (req, res) => {
        const sid = req.cookies[COOKIE_SID_KEY]
        if (!sid) return
        const { valid, cookie, session } = this.sessionService.validate(sid)
        res.setCookie(cookie)
        if (!valid || !session) return
        res.setHeader("Cache-Control", "private, no-store")
        res.setHeader("Vary", "Cookie")
        req.session = session
    }
}
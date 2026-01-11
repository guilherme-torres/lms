// import type { Middleware } from "../router.ts";
// import { RouteError } from "../utils/route-error.ts";

// export const verifySession: Middleware = (req, res) => {
//     const cookies = req.cookies
//     console.log(cookies)
//     if (!cookies.sid) {
//         throw new RouteError(401, "não autenticado")
//     }
//     const user = core.db.query(`
//         SELECT "email", "name" FROM "users"
//         WHERE "id" = ?
//     `).get(cookies.sid)
//     if (!user) {
//         throw new RouteError(401, "não autenticado")
//     }
// }
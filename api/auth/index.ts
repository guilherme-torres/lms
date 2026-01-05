import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { AuthRepository } from "./repository.ts";
import { authTables } from "./tables.ts";
import type { CreateUserData } from "./types.ts";

export class AuthApi extends Api {
    repository = new AuthRepository(this.db)

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
        }
    } satisfies Api['handlers']

    tables() {
        this.db.exec(authTables)
    }

    routes() {
        this.router.post("/auth/users", this.handlers.createUser)
    }
}
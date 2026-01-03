import { AuthApi } from "./api/auth/index.ts";
import { LmsApi } from "./api/lms/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/index.ts"

const core = new Core()

core.router.use([logger])

new AuthApi(core).init()
new LmsApi(core).init()

core.router.get("/", (req, res) => {
    res.end("Hello, World!")
})

core.init()
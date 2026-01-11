import { ServerResponse } from "node:http"

export interface CustomResponse extends ServerResponse {
    status: (statusCode: number) => CustomResponse
    json: (data: any) => void
    setCookie: (cookie: string) => void
}

export function customResponse(response: ServerResponse) {
    const res = response as CustomResponse
    res.status = statusCode => {
        res.statusCode = statusCode
        return res
    }

    res.json = data => {
        res.setHeader("Content-Type", "application/json")
        try {
            res.end(JSON.stringify(data))
        } catch {
            res.status(500).end()
        }
    }

    res.setCookie = cookie => {
        const current = res.getHeader("Set-Cookie")
        if (current === undefined) {
            res.setHeader("Set-Cookie", [cookie])
            return
        }
        if (Array.isArray(current)) {
            current.push(cookie)
            res.setHeader("Set-Cookie", current)
            return
        }
        res.setHeader("Set-Cookie", [String(current), cookie])
    }

    return res
}
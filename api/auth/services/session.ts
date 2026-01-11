import { CoreProvider } from "../../../core/utils/abstract.ts";
import { AuthRepository } from "../repository.ts";
import { randomBytesAsync, sha256Hash } from "../utils.ts";

const ttlSec = 15 * 24 * 60 * 60
const ttlSec5days = 5 * 24 * 60 * 60
export const COOKIE_SID_KEY = "__Secure-sid"

function sidCookie(sid: string, expires: number) {
    return `${COOKIE_SID_KEY}=${sid}; Path=/; Max-Age=${expires}; HttpOnly; Secure; SameSite=Lax`
}

export class SessionService extends CoreProvider {
    query = new AuthRepository(this.db)

    async create({ userId, ip, ua }:
        { userId: number, ip: string, ua: string }) {
        const sid = (await randomBytesAsync(32)).toString("base64url")
        const sid_hash = sha256Hash(sid)
        const expires_ms = Date.now() + ttlSec * 1000 // 15 dias
        this.query.insertSession({ sid_hash, user_id: userId, expires_ms, ip, ua })
        const cookie = sidCookie(sid, ttlSec)
        return { cookie }
    }

    validate(sid: string) {
        const now = Date.now()
        const sidHash = sha256Hash(sid)
        const session = this.query.getSession(sidHash)
        if (!session || session.revoked === 1) {
            return {
                valid: false,
                cookie: sidCookie("", 0)
            }
        }
        let expires_ms = session.expires_ms
        if (now >= expires_ms) {
            this.query.revokeSession("sid_hash", sidHash)
            return {
                valid: false,
                cookie: sidCookie("", 0)
            }
        }
        if (now >= expires_ms - 1000 * ttlSec5days) {
            const newExpiresMs = now + 1000 * ttlSec
            this.query.updateSessionExpires(sidHash, newExpiresMs)
            expires_ms = newExpiresMs
        }
        const user = this.query.selectUserRole(session.user_id)
        if (!user) {
            this.query.revokeSession("sid_hash", sidHash)
            return {
                valid: false,
                cookie: sidCookie("", 0)
            }
        }
        return {
            valid: true,
            cookie: sidCookie(sid, Math.floor((expires_ms - now) / 1000)),
            session: {
                user_id: session.user_id,
                role: user.role,
                expires_ms,
            }
        }
    }
}
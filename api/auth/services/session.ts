import { CoreProvider } from "../../../core/utils/abstract.ts";
import { AuthRepository } from "../repository.ts";
import { randomBytesAsync, sha256Hash } from "../utils.ts";

export class SessionService extends CoreProvider {
    query = new AuthRepository(this.db)

    async create({ userId, ip, ua }:
        { userId: number, ip: string, ua: string }) {
        const sid = (await randomBytesAsync(32)).toString("base64url")
        const sid_hash = sha256Hash(sid)
        const ttlSec = 15 * 24 * 60 * 60
        const expires_ms = Date.now() + ttlSec * 1000 // 15 dias
        this.query.insertSession({ sid_hash, user_id: userId, expires_ms, ip, ua })
        const cookie = `__Secure-sid=${sid}; Path=/; Max-Age=${ttlSec}; HttpOnly; Secure; SameSite=Lax`
        return { cookie }
    }
}
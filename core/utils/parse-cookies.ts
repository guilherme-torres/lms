export const parseCookies = (cookieHeader?: string) => {
    const cookies: Record<string, string | undefined> = {}
    if (!cookieHeader) return cookies
    const pairs = cookieHeader.split(";")
    for (const seg of pairs) {
        const pair = seg.trim()
        if (!pair) continue
        const sepIndex = pair.indexOf("=")
        const key = sepIndex === -1 ? pair : pair.slice(0, sepIndex).trim()
        if (!key) continue
        const value = sepIndex === -1 ? "" : pair.slice(sepIndex + 1).trim() || undefined
        cookies[key] = value
    }
    return cookies
}
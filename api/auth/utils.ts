import { promisify } from "node:util";
import { type BinaryLike, type BinaryToTextEncoding, createHash, randomBytes } from "node:crypto";

export const randomBytesAsync = promisify(randomBytes)

export const sha256Hash = (data: BinaryLike) => {
    return createHash("sha256").update(data).digest()
}
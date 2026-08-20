import { timingSafeEqual } from "crypto";

/**
 * Verifies the Authorization: Bearer <secret> header against LAMBDA_WEBHOOK_SECRET.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyWebhookSecret(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  const secret = process.env.LAMBDA_WEBHOOK_SECRET;

  if (!secret || !token) return false;

  try {
    const tokenBuf = Buffer.from(token);
    const secretBuf = Buffer.from(secret);

    if (tokenBuf.length !== secretBuf.length) return false;

    return timingSafeEqual(tokenBuf, secretBuf);
  } catch {
    return false;
  }
}

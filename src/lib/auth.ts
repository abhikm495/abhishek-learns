import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE = "admin_token";

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;
export const AUTH_MAX_AGE = THIRTY_DAYS_SECONDS;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Add it to your environment variables.");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

/** Issues a signed admin session token valid for 30 days. */
export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${THIRTY_DAYS_SECONDS}s`)
    .sign(getSecret());
}

/** Returns true when the token is a valid, unexpired admin token. */
export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

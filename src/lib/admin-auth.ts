import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portfolio_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin";
}

export function signAdminToken(password: string) {
  const secret = process.env.ADMIN_SECRET || password;
  return createHmac("sha256", secret).update(`ok:${password}`).digest("hex");
}

export function safeEqualString(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function isValidAdminToken(token: string | undefined) {
  if (!token) return false;
  const expected = signAdminToken(getAdminPassword());
  return safeEqualString(token, expected);
}

export async function requireAdmin() {
  const jar = await cookies();
  return isValidAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

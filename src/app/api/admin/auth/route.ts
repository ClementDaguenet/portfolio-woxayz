import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  requireAdmin,
  safeEqualString,
  signAdminToken,
} from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json({ ok: await requireAdmin() });
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (password.length > 200 || !safeEqualString(password, getAdminPassword())) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signAdminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

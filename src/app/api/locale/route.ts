import { NextResponse } from "next/server";

const LOCALES = new Set(["fr", "en"]);

export async function POST(request: Request) {
  let locale = "fr";
  try {
    const body = (await request.json()) as { locale?: string };
    if (body.locale && LOCALES.has(body.locale)) {
      locale = body.locale;
    }
  } catch {
    // keep default
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

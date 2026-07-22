import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_FROM, CONTACT_TO } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/rate-limit";

type Body = {
  name?: string;
  email?: string;
  subject?: string;
  requestType?: string;
  message?: string;
  /** Honeypot — must stay empty */
  website?: string;
};

const REQUEST_TYPES = new Set([
  "textures",
  "mod",
  "modpack",
  "resource-pack",
  "other",
]);

const LIMITS = {
  name: 100,
  email: 200,
  subject: 200,
  message: 5000,
} as const;

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.website && String(body.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const requestType = body.requestType?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !subject || !requestType || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  if (!REQUEST_TYPES.has(requestType)) {
    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] Resend missing (dev fallback)");
      return NextResponse.json({ ok: true, fallback: true });
    }
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `[WoXayZ · ${requestType}] ${subject}`,
      text: `De: ${name} <${email}>\nType: ${requestType}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}

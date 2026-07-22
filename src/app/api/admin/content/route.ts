import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  GAMING_CONTENT_FILES,
  type GamingContentKey,
  resolveGamingDataPath,
} from "@/lib/admin-files";

function isKey(value: string): value is GamingContentKey {
  return value in GAMING_CONTENT_FILES;
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!isKey(key)) {
    return NextResponse.json({ error: "Fichier inconnu" }, { status: 400 });
  }

  const raw = await fs.readFile(resolveGamingDataPath(key), "utf8");
  return NextResponse.json({
    key,
    label: GAMING_CONTENT_FILES[key].label,
    raw,
  });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { key?: string; raw?: string };
  const key = body.key ?? "";
  if (!isKey(key)) {
    return NextResponse.json({ error: "Fichier inconnu" }, { status: 400 });
  }

  try {
    const parsed = JSON.parse(body.raw ?? "");
    const pretty = `${JSON.stringify(parsed, null, 2)}\n`;
    await fs.writeFile(resolveGamingDataPath(key), pretty, "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "JSON invalide - corrige avant de sauvegarder" },
      { status: 400 },
    );
  }
}

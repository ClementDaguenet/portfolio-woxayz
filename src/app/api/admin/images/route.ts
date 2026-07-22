import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { GAMING_UPLOAD_DIR, GAMING_UPLOAD_PUBLIC } from "@/lib/admin-files";

const ALLOWED = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".ico",
]);

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const ROOTS = [
  { dir: () => GAMING_UPLOAD_DIR, publicBase: GAMING_UPLOAD_PUBLIC },
  {
    dir: () => path.join(process.cwd(), "public", "og"),
    publicBase: "/og",
  },
  {
    dir: () => path.join(process.cwd(), "public", "images", "og"),
    publicBase: "/images/og",
  },
] as const;

async function listImages(dir: string, publicBase: string, prefix = "") {
  const out: { name: string; url: string }[] = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(
        ...(await listImages(path.join(dir, entry.name), publicBase, rel)),
      );
    } else if (ALLOWED.has(path.extname(entry.name).toLowerCase())) {
      out.push({ name: rel, url: `${publicBase}/${rel.replace(/\\/g, "/")}` });
    }
  }
  return out;
}

function resolvePublicUrl(url: string) {
  const normalized = url.replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return null;

  if (normalized === "/favicon.ico") {
    const abs = path.resolve(process.cwd(), "public", "favicon.ico");
    return {
      abs,
      dir: path.dirname(abs),
      publicBase: "",
      relative: "favicon.ico",
    };
  }

  for (const root of ROOTS) {
    const base = root.publicBase;
    if (normalized === base || normalized.startsWith(`${base}/`)) {
      const relative = normalized.slice(base.length).replace(/^\//, "");
      if (!relative || relative.includes("..")) return null;
      const abs = path.resolve(root.dir(), ...relative.split("/"));
      const rootAbs = path.resolve(root.dir());
      if (!abs.startsWith(rootAbs + path.sep) && abs !== rootAbs) return null;
      return {
        abs,
        dir: path.dirname(abs),
        publicBase: base,
        relative,
      };
    }
  }
  return null;
}

function sanitizeFilename(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base =
    path
      .basename(name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "file";
  return `${base}${ext}`;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const images = [];
  for (const root of ROOTS) {
    await fs.mkdir(root.dir(), { recursive: true });
    images.push(...(await listImages(root.dir(), root.publicBase)));
  }
  try {
    await fs.access(path.join(process.cwd(), "public", "favicon.ico"));
    images.unshift({ name: "favicon.ico", url: "/favicon.ico" });
  } catch {
    // optional
  }
  images.sort((a, b) => a.url.localeCompare(b.url));
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) {
    return NextResponse.json({ error: "Format non supporté" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 413 });
  }

  const safeBase =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "image";
  const filename = `${safeBase}-${Date.now()}${ext}`;

  if (ext === ".ico") {
    const target = path.join(process.cwd(), "public", "favicon.ico");
    await fs.mkdir(path.dirname(target), { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(target, buffer);
    return NextResponse.json({ ok: true, url: "/favicon.ico" });
  }

  await fs.mkdir(GAMING_UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(GAMING_UPLOAD_DIR, filename), buffer);

  return NextResponse.json({
    ok: true,
    url: `${GAMING_UPLOAD_PUBLIC}/${filename}`,
  });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string; newName?: string };
  if (!body.url || !body.newName) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const resolved = resolvePublicUrl(body.url);
  if (!resolved) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const newName = sanitizeFilename(body.newName);
  const newExt = path.extname(newName).toLowerCase();
  if (!ALLOWED.has(newExt)) {
    return NextResponse.json({ error: "Extension non supportée" }, { status: 400 });
  }

  const dest = path.join(resolved.dir, newName);
  if (dest === resolved.abs) {
    return NextResponse.json({ ok: true, url: body.url });
  }

  try {
    await fs.access(dest);
    return NextResponse.json(
      { error: "Un fichier porte déjà ce nom" },
      { status: 409 },
    );
  } catch {
    // ok
  }

  await fs.rename(resolved.abs, dest);
  const relDir = path.dirname(resolved.relative).replace(/\\/g, "/");
  const newRel =
    relDir && relDir !== "." ? `${relDir}/${newName}` : newName;
  return NextResponse.json({
    ok: true,
    url: `${resolved.publicBase}/${newRel}`,
  });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string };
  if (!body.url) {
    return NextResponse.json({ error: "URL manquante" }, { status: 400 });
  }

  const resolved = resolvePublicUrl(body.url);
  if (!resolved) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  await fs.unlink(resolved.abs);
  return NextResponse.json({ ok: true });
}

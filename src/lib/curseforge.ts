import type { CreationType, GamingCreation } from "@/types/gaming";

const CLASS_ID: Record<CreationType, number> = {
  mod: 6,
  "resource-pack": 12,
  modpack: 4471,
};

const PATH_TO_CLASS: Record<string, number> = {
  "mc-mods": 6,
  "texture-packs": 12,
  modpacks: 4471,
};

export type CurseforgeRole = "owner" | "artist" | "contributor";

export interface CreationLiveMeta {
  downloads: number;
  logoUrl?: string;
  role?: CurseforgeRole;
  mcVersions?: string[];
}

type LiveMetaMap = Record<string, CreationLiveMeta>;

interface CurseforgeModPayload {
  id: number;
  downloadCount?: number;
  logo?: { url?: string; thumbnailUrl?: string };
  authors?: Array<{ id?: number; name?: string; url?: string }>;
}

function getAuthorUsername(): string {
  return (
    process.env.CURSEFORGE_AUTHOR?.trim() ||
    process.env.NEXT_PUBLIC_CURSEFORGE_AUTHOR?.trim() ||
    "WoXayZ"
  );
}

export function getCurseforgeApiKey(): string | null {
  const raw = process.env.CURSEFORGE_API_KEY?.trim();
  if (!raw) return null;

  const key = raw.replace(/^['"]|['"]$/g, "");
  if (!key || key === "fake_key_replace_me" || key.startsWith("fake_")) {
    return null;
  }

  return key;
}

function parseCurseforgeUrl(url: string): {
  slug: string;
  classId: number;
  widgetPath: string;
} | null {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length < 3 || parts[0] !== "minecraft") return null;
    const section = parts[1];
    const slug = parts[2];
    const classId = PATH_TO_CLASS[section];
    if (!slug || !classId) return null;
    return {
      slug,
      classId,
      widgetPath: `minecraft/${section}/${slug}`,
    };
  } catch {
    return null;
  }
}

function normalizeRole(raw: string | undefined | null): CurseforgeRole | undefined {
  if (!raw) return undefined;
  const value = raw.trim().toLowerCase();
  if (value.includes("owner") || value.includes("author")) return "owner";
  if (value.includes("artist")) return "artist";
  if (value.includes("contributor") || value.includes("member")) {
    return "contributor";
  }
  return undefined;
}

async function fetchModsByIds(
  apiKey: string,
  modIds: number[],
): Promise<Map<number, CurseforgeModPayload>> {
  const result = new Map<number, CurseforgeModPayload>();
  if (modIds.length === 0) return result;

  const response = await fetch("https://api.curseforge.com/v1/mods", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ modIds }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) return result;

  const json = (await response.json()) as { data?: CurseforgeModPayload[] };
  for (const mod of json.data ?? []) {
    result.set(mod.id, mod);
  }

  return result;
}

async function searchMod(
  apiKey: string,
  slug: string,
  classId: number,
): Promise<CurseforgeModPayload | null> {
  const url = new URL("https://api.curseforge.com/v1/mods/search");
  url.searchParams.set("gameId", "432");
  url.searchParams.set("classId", String(classId));
  url.searchParams.set("slug", slug);
  url.searchParams.set("pageSize", "5");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const json = (await response.json()) as {
    data?: Array<CurseforgeModPayload & { slug?: string }>;
  };
  return (
    json.data?.find((m) => m.slug === slug) ?? json.data?.[0] ?? null
  );
}

function isMcVersion(v: string): boolean {
  return /^1\.\d+(\.\d+)?$/.test(v);
}

function sortMcVersions(versions: string[]): string[] {
  return [...versions].sort((a, b) => {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      const d = (pb[i] || 0) - (pa[i] || 0);
      if (d) return d;
    }
    return 0;
  });
}

function extractWidgetVersions(versions: unknown): string[] {
  const set = new Set<string>();
  if (versions && typeof versions === "object" && !Array.isArray(versions)) {
    for (const key of Object.keys(versions as Record<string, unknown>)) {
      if (isMcVersion(key)) set.add(key);
    }
  }
  if (Array.isArray(versions)) {
    for (const v of versions) {
      if (typeof v === "string" && isMcVersion(v)) set.add(v);
    }
  }
  return sortMcVersions([...set]);
}

async function fetchViaCfWidget(widgetPath: string): Promise<{
  downloads?: number;
  logoUrl?: string;
  role?: CurseforgeRole;
  mcVersions?: string[];
} | null> {
  try {
    const response = await fetch(`https://api.cfwidget.com/${widgetPath}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "woxayz-portfolio",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const json = (await response.json()) as {
      downloads?: { total?: number };
      thumbnail?: string;
      members?: Array<{ title?: string; username?: string }>;
      versions?: unknown;
    };

    const author = getAuthorUsername().toLowerCase();
    const member = json.members?.find(
      (m) => m.username?.toLowerCase() === author,
    );
    const mcVersions = extractWidgetVersions(json.versions);

    return {
      downloads:
        typeof json.downloads?.total === "number"
          ? json.downloads.total
          : undefined,
      logoUrl: json.thumbnail || undefined,
      role: normalizeRole(member?.title),
      mcVersions: mcVersions.length > 0 ? mcVersions : undefined,
    };
  } catch {
    return null;
  }
}

function logoFromMod(mod: CurseforgeModPayload): string | undefined {
  return mod.logo?.thumbnailUrl || mod.logo?.url || undefined;
}

export async function getCreationLiveMeta(
  creations: GamingCreation[],
): Promise<{
  meta: LiveMetaMap;
  source: "curseforge" | "cfwidget" | "static" | "mixed";
}> {
  const meta: LiveMetaMap = Object.fromEntries(
    creations.map((c) => [
      c.id,
      {
        downloads: c.downloads,
        logoUrl: c.image || undefined,
        role: normalizeRole(c.role),
        mcVersions: c.mcVersions,
      } satisfies CreationLiveMeta,
    ]),
  );

  const apiKey = getCurseforgeApiKey();
  const apiDownloads = new Set<string>();
  const apiLogos = new Set<string>();
  let usedCurseforge = false;
  let usedWidget = false;

  const withIds = creations.filter(
    (c) => typeof c.curseforgeId === "number" && c.curseforgeId > 0,
  );
  const withoutIds = creations.filter(
    (c) => !(typeof c.curseforgeId === "number" && c.curseforgeId > 0),
  );

  const applyMod = (creationId: string, mod: CurseforgeModPayload) => {
    usedCurseforge = true;
    const current = meta[creationId];
    if (typeof mod.downloadCount === "number") {
      current.downloads = mod.downloadCount;
      apiDownloads.add(creationId);
    }
    const logo = logoFromMod(mod);
    if (logo) {
      current.logoUrl = logo;
      apiLogos.add(creationId);
    }
  };

  if (apiKey) {
    try {
      if (withIds.length > 0) {
        const byId = await fetchModsByIds(
          apiKey,
          withIds.map((c) => c.curseforgeId as number),
        );
        for (const creation of withIds) {
          const mod = byId.get(creation.curseforgeId as number);
          if (mod) applyMod(creation.id, mod);
        }
      }

      await Promise.all(
        withoutIds.map(async (creation) => {
          const parsed = parseCurseforgeUrl(creation.curseforgeUrl);
          if (!parsed) return;
          const mod = await searchMod(
            apiKey,
            parsed.slug,
            parsed.classId ?? CLASS_ID[creation.type],
          );
          if (mod) applyMod(creation.id, mod);
        }),
      );
    } catch {
      // widget / static fallback
    }
  }

  await Promise.all(
    creations.map(async (creation) => {
      const parsed = parseCurseforgeUrl(creation.curseforgeUrl);
      if (!parsed) return;

      const widget = await fetchViaCfWidget(parsed.widgetPath);
      if (!widget) return;

      usedWidget = true;
      const current = meta[creation.id];

      if (
        typeof widget.downloads === "number" &&
        !apiDownloads.has(creation.id)
      ) {
        current.downloads = widget.downloads;
      }
      if (widget.logoUrl && !apiLogos.has(creation.id)) {
        current.logoUrl = widget.logoUrl;
      }
      if (widget.role) {
        current.role = widget.role;
      }
      if (widget.mcVersions?.length) {
        current.mcVersions = widget.mcVersions;
      }
    }),
  );

  let source: "curseforge" | "cfwidget" | "static" | "mixed" = "static";
  if (usedCurseforge && usedWidget) source = "mixed";
  else if (usedCurseforge) source = "curseforge";
  else if (usedWidget) source = "cfwidget";

  return { meta, source };
}

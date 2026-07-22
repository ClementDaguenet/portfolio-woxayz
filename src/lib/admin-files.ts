import path from "path";

export const GAMING_CONTENT_FILES = {
  creations: {
    label: "Creations",
    relativePath: "src/data/gamingCreations.json",
  },
  textures: {
    label: "Textures",
    relativePath: "src/data/gamingTextures.json",
  },
  pricing: {
    label: "Tarifs",
    relativePath: "src/data/gamingPricing.json",
  },
  about: {
    label: "A propos",
    relativePath: "src/data/gamingAbout.json",
  },
  site: {
    label: "Images / chemins site",
    relativePath: "src/data/gamingSite.json",
  },
  textsFr: {
    label: "Textes UI (FR)",
    relativePath: "src/i18n/messages/fr.json",
  },
  textsEn: {
    label: "Textes UI (EN)",
    relativePath: "src/i18n/messages/en.json",
  },
} as const;

export type GamingContentKey = keyof typeof GAMING_CONTENT_FILES;

export function resolveGamingDataPath(key: GamingContentKey) {
  return path.join(process.cwd(), GAMING_CONTENT_FILES[key].relativePath);
}

export const GAMING_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "gaming",
);
export const GAMING_UPLOAD_PUBLIC = "/images/gaming";

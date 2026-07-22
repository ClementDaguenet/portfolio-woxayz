import { readFileSync } from "fs";
import path from "path";
import type {
  GamingAboutData,
  GamingCreation,
  GamingCreationsData,
  GamingPricingData,
  GamingSiteSettings,
  GamingTexture,
  GamingTexturesData,
} from "@/types/gaming";

function readJson<T>(relativePath: string): T {
  const full = path.join(process.cwd(), relativePath);
  const raw = readFileSync(full, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

export function getCreations(): GamingCreation[] {
  return readJson<GamingCreationsData>("src/data/gamingCreations.json")
    .creations;
}

export function getTextures(): GamingTexture[] {
  return readJson<GamingTexturesData>("src/data/gamingTextures.json").textures;
}

export function getPricing(): GamingPricingData {
  return readJson<GamingPricingData>("src/data/gamingPricing.json");
}

export function getAbout(): GamingAboutData {
  return readJson<GamingAboutData>("src/data/gamingAbout.json");
}

export function getSiteSettings(): GamingSiteSettings {
  return readJson<GamingSiteSettings>("src/data/gamingSite.json");
}

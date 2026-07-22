export type CreationType = "resource-pack" | "mod" | "modpack";

export type TextureCategory = "Item" | "Block" | "GUI" | "Other";

export interface GamingCreation {
  id: string;
  name: string;
  type: CreationType;
  mcVersions: string[];
  releaseDate: string;
  downloads: number;
  curseforgeUrl: string;
  /** Project ID CurseForge (optionnel, accélère l’API officielle) */
  curseforgeId?: number;
  /** Rôle override si l’API ne le remonte pas (owner | artist | contributor) */
  role?: "owner" | "artist" | "contributor";
  /** Fallback local si le logo CurseForge est indisponible */
  image: string;
  summaryFr: string;
  summaryEn: string;
}

export interface GamingCreationsData {
  creations: GamingCreation[];
}

export interface GamingTexture {
  id: string;
  title: string;
  category: TextureCategory;
  image: string;
}

export interface GamingTexturesData {
  textures: GamingTexture[];
}

export interface PricingItem {
  id: string;
  labelFr: string;
  labelEn: string;
  price: number;
}

export interface GamingPricingData {
  items: PricingItem[];
  licenseFr: string;
  licenseEn: string;
  paypal: string;
  patreon: string;
}

export interface GamingAboutData {
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  passionFr: string;
  passionEn: string;
}

export interface GamingSiteSettings {
  banner: string;
  ogImage: string;
  favicon: string;
}

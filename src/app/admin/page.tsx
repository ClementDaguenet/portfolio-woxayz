import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";
import { GAMING_CONTENT_FILES } from "@/lib/admin-files";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const files = Object.entries(GAMING_CONTENT_FILES).map(([key, value]) => ({
  key,
  label: value.label,
}));

const imageSpecs = [
  {
    label: "Favicon (onglet navigateur)",
    size: "32 × 32 px (ou 48 × 48)",
    hint: "fichier .ico",
    jsonField: "Images / chemins site → favicon",
  },
  {
    label: "Bannière hero",
    size: "1920 × 600 px",
    hint: "plein largeur, peu de texte dessus",
    jsonField: "Images / chemins site → banner",
  },
  {
    label: "Preview création (mod/pack)",
    size: "800 × 450 px",
    hint: "16:9, vignette carte",
    jsonField: "gamingCreations.json → image",
  },
  {
    label: "Texture galerie",
    size: "512 × 512 px",
    hint: "carré (256 ok si pixel-art)",
    jsonField: "gamingTextures.json → image",
  },
  {
    label: "Open Graph / partage",
    size: "1200 × 630 px",
    hint: "réseaux sociaux",
    jsonField: "Images / chemins site → ogImage",
  },
];

export default function AdminPage() {
  return (
    <AdminPanel title="Admin WoXayZ" files={files} imageSpecs={imageSpecs} />
  );
}

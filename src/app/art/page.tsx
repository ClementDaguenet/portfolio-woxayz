import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArtGallery } from "@/components/ArtGallery";
import { getTextures } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("art");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ArtPage() {
  const t = await getTranslations("art");
  const textures = getTextures();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-10">
        <h1 className="font-title text-3xl font-bold md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">{t("subtitle")}</p>
      </header>
      <ArtGallery textures={textures} />
    </div>
  );
}

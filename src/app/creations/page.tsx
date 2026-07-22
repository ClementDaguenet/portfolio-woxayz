import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CreationsTabs } from "@/components/CreationsTabs";
import { getCreationLiveMeta } from "@/lib/curseforge";
import { getCreations } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("creations");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function CreationsPage() {
  const t = await getTranslations("creations");
  const creations = getCreations();
  const { meta } = await getCreationLiveMeta(creations);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-10">
        <h1 className="font-title text-3xl font-bold md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">{t("subtitle")}</p>
      </header>
      <CreationsTabs creations={creations} liveMeta={meta} />
    </div>
  );
}

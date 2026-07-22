import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PricingTable } from "@/components/PricingTable";
import { getPricing } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const data = getPricing();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-10">
        <h1 className="font-title text-3xl font-bold md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">{t("subtitle")}</p>
      </header>
      <PricingTable data={data} />
    </div>
  );
}

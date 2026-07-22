import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutContent } from "@/components/AboutContent";
import { getAbout } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const data = getAbout();
  return {
    title: t("title"),
    description: locale === "en" ? data.bodyEn : data.bodyFr,
  };
}

export default async function AboutPage() {
  const data = getAbout();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <AboutContent data={data} />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getAbout, getSiteSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const site = getSiteSettings();
  const homeLabel = locale === "en" ? "Home" : "Accueil";
  return {
    title: {
      absolute: `${homeLabel} · WoXayZ`,
    },
    description:
      locale === "en"
        ? "WoXayZ - Minecraft creator of resource packs, mods and modpacks."
        : "WoXayZ - créateur Minecraft de resource packs, mods et modpacks.",
    openGraph: {
      title: "WoXayZ",
      images: [{ url: site.ogImage }],
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const about = getAbout();
  const site = getSiteSettings();
  const passion = locale === "en" ? about.passionEn : about.passionFr;

  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.banner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-[var(--bg)]/70 to-[var(--bg)]" />

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-32">
          <h1 className="font-title neon-text text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            WoXayZ
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--text)]/90 md:text-xl">
            {t("subtitle")}
          </p>
          <p className="mt-6 max-w-lg text-[var(--text-muted)] leading-relaxed">
            {passion}
          </p>
          <div className="mt-8">
            <Link
              href="/creations"
              className="inline-flex rounded-md border border-[var(--border-neon)] bg-[var(--primary)]/25 px-6 py-3 font-title text-sm font-semibold uppercase tracking-wide text-[var(--text)] shadow-[var(--glow)] transition hover:scale-[1.02] hover:bg-[var(--primary)]/40"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

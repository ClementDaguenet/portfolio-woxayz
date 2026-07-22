import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  return {
    title: t("title"),
    description: "Mentions légales - WoXayZ / Clément Daguenet",
  };
}

export default async function MentionsLegalesPage() {
  const t = await getTranslations("legal");
  const locale = await getLocale();
  const isEn = locale === "en";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-title mb-8 text-3xl font-bold md:text-4xl">
        {t("title")}
      </h1>

      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-title mb-2 text-lg font-semibold text-[var(--text)]">
            {isEn ? "Publisher" : "Éditeur"}
          </h2>
          <p>
            Clément Daguenet
            <br />
            {isEn ? "Individual (particulier)" : "Particulier"}
            <br />
            Email :{" "}
            <a
              href="mailto:contact@woxayz.fr"
              className="text-[var(--primary)] hover:text-[var(--accent)]"
            >
              contact@woxayz.fr
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-title mb-2 text-lg font-semibold text-[var(--text)]">
            {isEn ? "Hosting" : "Hébergeur"}
          </h2>
          <p>
            OVH SAS
            <br />
            2 rue Kellermann
            <br />
            59100 Roubaix - France
            <br />
            <a
              href="https://www.ovhcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:text-[var(--accent)]"
            >
              www.ovhcloud.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-title mb-2 text-lg font-semibold text-[var(--text)]">
            {isEn ? "Intellectual property" : "Propriété intellectuelle"}
          </h2>
          <p>
            {isEn
              ? "All content on this site (texts, visuals, trademarks) is protected. Minecraft is a trademark of Mojang Studios / Microsoft. CurseForge projects remain under their respective licenses."
              : "L'ensemble du contenu de ce site (textes, visuels, marques) est protégé. Minecraft est une marque de Mojang Studios / Microsoft. Les projets CurseForge restent soumis à leurs licences respectives."}
          </p>
        </section>
      </div>
    </div>
  );
}

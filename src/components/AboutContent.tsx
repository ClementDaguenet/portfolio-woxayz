import { getLocale } from "next-intl/server";
import type { GamingAboutData } from "@/types/gaming";

interface AboutContentProps {
  data: GamingAboutData;
}

export async function AboutContent({ data }: AboutContentProps) {
  const locale = await getLocale();
  const title = locale === "en" ? data.titleEn : data.titleFr;
  const body = locale === "en" ? data.bodyEn : data.bodyFr;
  const passion = locale === "en" ? data.passionEn : data.passionFr;

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-title text-3xl font-bold text-[var(--text)] md:text-4xl">
        {title}
      </h1>
      <p className="text-lg leading-relaxed text-[var(--text-muted)]">{body}</p>
      <div className="gaming-card p-6">
        <p className="leading-relaxed text-[var(--text)]">{passion}</p>
      </div>
    </article>
  );
}

"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import type { CreationLiveMeta } from "@/lib/curseforge";
import type { GamingCreation } from "@/types/gaming";

interface CreationCardProps {
  creation: GamingCreation;
  live?: CreationLiveMeta;
}

export function CreationCard({ creation, live }: CreationCardProps) {
  const t = useTranslations("creations");
  const locale = useLocale();
  const summary =
    locale === "en" ? creation.summaryEn : creation.summaryFr;
  const count = live?.downloads ?? creation.downloads;
  const logoUrl = live?.logoUrl || creation.image;
  const role = live?.role ?? creation.role;
  const versions =
    live?.mcVersions && live.mcVersions.length > 0
      ? live.mcVersions
      : creation.mcVersions;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="gaming-card overflow-hidden"
    >
      <div className="flex h-40 items-center justify-center bg-[linear-gradient(145deg,rgba(232,121,249,0.12),rgba(15,15,20,0.9))]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={creation.name}
          className="h-28 w-28 object-contain"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 font-title text-base font-semibold text-[var(--text)]">
            {creation.name}
          </h3>
          <div className="flex shrink-0 flex-row flex-nowrap items-center gap-1.5">
            <span className="whitespace-nowrap rounded border border-[var(--border-neon)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--accent)]">
              {t(`types.${creation.type}`)}
            </span>
            {role ? (
              <span className="whitespace-nowrap rounded border border-[var(--primary)]/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--primary)]">
                {t(`roles.${role}`)}
              </span>
            ) : null}
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">{summary}</p>
        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
          {t("mcVersions")}: {versions.join(", ")}
        </p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-medium text-[var(--primary)]">
            {count.toLocaleString(locale)} {t("downloads")}
          </span>
          <a
            href={creation.curseforgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
          >
            {t("viewOnCurseforge")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

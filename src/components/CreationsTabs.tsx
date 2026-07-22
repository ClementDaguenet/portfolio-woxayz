"use client";

import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { CreationLiveMeta } from "@/lib/curseforge";
import type { CreationType, GamingCreation } from "@/types/gaming";
import { CreationCard } from "./CreationCard";

type Tab = "all" | CreationType;

const TABS: Tab[] = ["all", "resource-pack", "mod", "modpack"];

interface CreationsTabsProps {
  creations: GamingCreation[];
  liveMeta?: Record<string, CreationLiveMeta>;
}

export function CreationsTabs({ creations, liveMeta }: CreationsTabsProps) {
  const t = useTranslations("creations.tabs");
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    const list =
      tab === "all"
        ? creations
        : creations.filter((c) => c.type === tab);

    return [...list].sort((a, b) => {
      const da = liveMeta?.[a.id]?.downloads ?? a.downloads;
      const db = liveMeta?.[b.id]?.downloads ?? b.downloads;
      return db - da;
    });
  }, [creations, tab, liveMeta]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              tab === key
                ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] shadow-[var(--glow)]"
                : "border-[var(--border-neon)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((creation) => (
            <CreationCard
              key={creation.id}
              creation={creation}
              live={liveMeta?.[creation.id]}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

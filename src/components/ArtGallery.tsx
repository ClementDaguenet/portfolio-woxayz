"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { GamingTexture } from "@/types/gaming";

interface ArtGalleryProps {
  textures: GamingTexture[];
}

export function ArtGallery({ textures }: ArtGalleryProps) {
  const t = useTranslations("art");
  const [active, setActive] = useState<GamingTexture | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="masonry">
        {textures.map((tex, i) => (
          <button
            key={tex.id}
            type="button"
            onClick={() => setActive(tex)}
            className="masonry-item gaming-card group w-full overflow-hidden text-left transition hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            style={{ marginTop: i % 3 === 1 ? "1.5rem" : undefined }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tex.image}
              alt={tex.title}
              className="w-full object-cover transition group-hover:scale-[1.02]"
              style={{ aspectRatio: i % 2 === 0 ? "1 / 1" : "4 / 5" }}
            />
            <div className="p-3">
              <p className="font-title text-sm font-semibold">{tex.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{tex.category}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-xl border border-[var(--border-neon)] bg-[var(--card)] shadow-[var(--glow)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-[var(--text)]"
                aria-label={t("close")}
              >
                <X className="h-4 w-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.image}
                alt={active.title}
                className="max-h-[75vh] w-full object-contain"
              />
              <div className="p-4">
                <p className="font-title text-lg font-semibold">{active.title}</p>
                <p className="text-sm text-[var(--text-muted)]">
                  {active.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

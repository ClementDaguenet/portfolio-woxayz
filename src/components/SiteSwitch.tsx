"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

const PRO_URL =
  process.env.NEXT_PUBLIC_PRO_URL || "https://clement-daguenet.fr/";

export function SiteSwitch() {
  const t = useTranslations("switch");
  const controls = useAnimationControls();
  const [flipping, setFlipping] = useState(false);

  async function goPro() {
    if (flipping) return;
    setFlipping(true);
    await controls.start({
      rotateY: 180,
      scale: 0.92,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    });
    window.location.href = PRO_URL.endsWith("/") ? PRO_URL : `${PRO_URL}/`;
  }

  return (
    <motion.button
      type="button"
      onClick={goPro}
      animate={controls}
      style={{ transformStyle: "preserve-3d" }}
      className="relative inline-flex items-center gap-1.5 rounded-md border border-[var(--border-neon)] bg-[var(--card)] px-2.5 py-1.5 text-sm shadow-[var(--glow)]"
      aria-label={t("toPro")}
      title={t("toPro")}
    >
      <span aria-hidden>💼</span>
      <span className="text-[var(--text-muted)]" aria-hidden>
        /
      </span>
      <span aria-hidden>🎮</span>
    </motion.button>
  );
}

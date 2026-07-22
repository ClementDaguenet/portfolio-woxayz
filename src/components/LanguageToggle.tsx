"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function setLocale(next: "fr" | "en") {
    if (next === locale || pending) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      className="inline-flex items-center rounded-md border border-[var(--border-neon)] bg-[var(--card)] p-0.5 text-xs shadow-[var(--glow)]"
      role="group"
      aria-label={t("label")}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        disabled={pending}
        className={`rounded px-2 py-1 font-semibold uppercase tracking-wider transition ${
          locale === "fr"
            ? "bg-[var(--primary)] text-white"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
        aria-pressed={locale === "fr"}
      >
        {t("fr")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        disabled={pending}
        className={`rounded px-2 py-1 font-semibold uppercase tracking-wider transition ${
          locale === "en"
            ? "bg-[var(--primary)] text-white"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
        aria-pressed={locale === "en"}
      >
        {t("en")}
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const PRO_URL =
  process.env.NEXT_PUBLIC_PRO_URL || "https://clement-daguenet.fr/";

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--border-neon)] bg-[var(--card)]/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-title text-lg font-bold text-[var(--accent)]">
            WoXayZ
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            © {year} WoXayZ. {t("rights")}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-[var(--text-muted)]">{t("discord")}: </span>
            <span className="text-[var(--text)]">woxayz</span>
          </p>
          <p>
            <span className="text-[var(--text-muted)]">{t("twitch")}: </span>
            <a
              href="https://twitch.tv/woxayz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:text-[var(--accent)]"
            >
              twitch.tv/woxayz
            </a>
            <span className="ml-1 text-xs text-[var(--text-muted)]">
              ({t("twitchNote")})
            </span>
          </p>
          <p>
            <span className="text-[var(--text-muted)]">{t("contact")}: </span>
            <Link
              href="/contact"
              className="text-[var(--primary)] hover:text-[var(--accent)]"
            >
              {t("contactLink")}
            </Link>
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <a
            href={PRO_URL.endsWith("/") ? PRO_URL : `${PRO_URL}/`}
            className="block text-[var(--primary)] hover:text-[var(--accent)]"
          >
            {t("mirror")} →
          </a>
          <Link
            href="/mentions-legales"
            className="block text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";
import { SiteSwitch } from "./SiteSwitch";

const links = [
  { href: "/", key: "home" as const },
  { href: "/creations", key: "creations" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/art", key: "art" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-neon)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-title text-lg font-bold tracking-wide text-[var(--accent)] neon-text"
        >
          WoXayZ
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <SiteSwitch />
        </div>
      </div>

      <nav className="flex gap-3 overflow-x-auto border-t border-[var(--border-neon)]/40 px-4 py-2 md:hidden">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-xs ${
                active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
              }`}
            >
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

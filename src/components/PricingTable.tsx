"use client";

import { useLocale, useTranslations } from "next-intl";
import type { GamingPricingData } from "@/types/gaming";

interface PricingTableProps {
  data: GamingPricingData;
}

export function PricingTable({ data }: PricingTableProps) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const license = locale === "en" ? data.licenseEn : data.licenseFr;

  return (
    <div className="space-y-10">
      <div className="gaming-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-neon)] bg-[var(--primary)]/10">
              <th className="px-4 py-3 font-title font-semibold">
                {t("category")}
              </th>
              <th className="px-4 py-3 font-title font-semibold">
                {t("price")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[var(--border-neon)]/40 last:border-0"
              >
                <td className="px-4 py-3">
                  {locale === "en" ? item.labelEn : item.labelFr}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--accent)]">
                  {item.price.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section>
        <h2 className="font-title mb-3 text-xl font-semibold">{t("license")}</h2>
        <p className="max-w-2xl text-[var(--text-muted)] leading-relaxed">
          {license}
        </p>
      </section>

      <section>
        <h2 className="font-title mb-4 text-xl font-semibold">{t("donate")}</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={data.paypal}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--border-neon)] bg-[var(--primary)]/20 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-[var(--glow)] transition hover:bg-[var(--primary)]/35"
          >
            {t("paypal")}
          </a>
          <a
            href={data.patreon}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[var(--border-neon)] bg-[var(--accent)]/20 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-[var(--glow)] transition hover:bg-[var(--accent)]/35"
          >
            {t("patreon")}
          </a>
        </div>
      </section>
    </div>
  );
}

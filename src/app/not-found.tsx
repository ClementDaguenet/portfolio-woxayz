"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-10 h-32 w-32">
        <div className="creeper-face creeper-explode absolute inset-0 grid grid-cols-8 grid-rows-8 overflow-hidden rounded-sm border border-green-700 bg-[#1a7a1a]">
          {/* Creeper face pixels */}
          <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-black" />
          <div className="col-start-6 col-end-8 row-start-2 row-end-4 bg-black" />
          <div className="col-start-4 col-end-6 row-start-4 row-end-6 bg-black" />
          <div className="col-start-3 col-end-4 row-start-5 row-end-8 bg-black" />
          <div className="col-start-6 col-end-7 row-start-5 row-end-8 bg-black" />
          <div className="col-start-4 col-end-6 row-start-6 row-end-8 bg-black" />
        </div>

        {[
          { dx: "-60px", dy: "-80px", color: "#3d9a3d" },
          { dx: "70px", dy: "-50px", color: "#1a5a1a" },
          { dx: "-80px", dy: "40px", color: "#2d7a2d" },
          { dx: "55px", dy: "70px", color: "#0a4a0a" },
          { dx: "0px", dy: "-90px", color: "#4aba4a" },
          { dx: "-40px", dy: "90px", color: "#1a7a1a" },
        ].map((d, i) => (
          <span
            key={i}
            className="creeper-debris visible absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm"
            style={
              {
                background: d.color,
                "--dx": d.dx,
                "--dy": d.dy,
                animationDelay: `${2.2 + i * 0.05}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <p className="font-title mb-2 text-6xl font-bold text-[var(--accent)]">
        404
      </p>
      <h1 className="font-title mb-6 text-2xl font-semibold text-[var(--text)]">
        {t("message")}
      </h1>
      <Link
        href="/"
        className="rounded-md border border-[var(--border-neon)] bg-[var(--primary)]/25 px-5 py-2.5 text-sm font-semibold shadow-[var(--glow)] transition hover:bg-[var(--primary)]/40"
      >
        {t("back")}
      </Link>
    </div>
  );
}

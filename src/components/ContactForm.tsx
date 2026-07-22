"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "loading" | "success" | "error";

const REQUEST_TYPES = [
  "textures",
  "mod",
  "modpack",
  "resource-pack",
  "other",
] as const;

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          requestType: data.get("requestType"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-4">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm text-[var(--text)]"
        >
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          className="w-full rounded-md border border-[var(--border-neon)] bg-[var(--card)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm text-[var(--text)]"
        >
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className="w-full rounded-md border border-[var(--border-neon)] bg-[var(--card)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
        />
      </div>
      <div>
        <label
          htmlFor="requestType"
          className="mb-1 block text-sm text-[var(--text)]"
        >
          {t("requestType")}
        </label>
        <select
          id="requestType"
          name="requestType"
          required
          defaultValue=""
          className="w-full rounded-md border border-[var(--border-neon)] bg-[var(--card)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
        >
          <option value="" disabled>
            {t("requestTypePlaceholder")}
          </option>
          {REQUEST_TYPES.map((key) => (
            <option key={key} value={key}>
              {t(`requestTypes.${key}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="subject"
          className="mb-1 block text-sm text-[var(--text)]"
        >
          {t("subject")}
        </label>
        <input
          id="subject"
          name="subject"
          required
          placeholder={t("subjectPlaceholder")}
          className="w-full rounded-md border border-[var(--border-neon)] bg-[var(--card)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm text-[var(--text)]"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={t("messagePlaceholder")}
          className="w-full resize-y rounded-md border border-[var(--border-neon)] bg-[var(--card)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)] focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-md border border-[var(--accent)] bg-[var(--accent)]/20 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/30 disabled:opacity-60"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>
      {status === "success" ? (
        <p className="text-sm text-emerald-400" role="status">
          {t("success")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-400" role="alert">
          {t("error")}
        </p>
      ) : null}
    </form>
  );
}

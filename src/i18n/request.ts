import { cookies } from "next/headers";
import { readFileSync } from "fs";
import path from "path";
import { getRequestConfig } from "next-intl/server";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

function loadMessages(locale: Locale) {
  const full = path.join(
    process.cwd(),
    "src",
    "i18n",
    "messages",
    `${locale}.json`,
  );
  const raw = readFileSync(full, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as Record<string, unknown>;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale =
    raw === "en" || raw === "fr" ? raw : defaultLocale;

  return {
    locale,
    messages: loadMessages(locale),
  };
});

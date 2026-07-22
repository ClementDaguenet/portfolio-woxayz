import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-10 text-center">
        <h1 className="font-title text-3xl font-bold text-[var(--accent)] md:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-[var(--text-muted)]">
          {t("subtitle")}
        </p>
      </header>
      <ContactForm />
    </div>
  );
}

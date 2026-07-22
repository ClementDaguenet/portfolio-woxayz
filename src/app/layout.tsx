import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://woxayz.fr";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteSettings();
  const og = site.ogImage || "/og/default.svg";
  const favicon = site.favicon || "/favicon.ico";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "WoXayZ - Minecraft Creator",
      template: "%s · WoXayZ",
    },
    description:
      "Créateur Minecraft - resource packs, mods et modpacks. Portfolio gaming de WoXayZ.",
    icons: {
      icon: [{ url: favicon, type: "image/x-icon" }],
      shortcut: favicon,
    },
    openGraph: {
      title: "WoXayZ - Minecraft Creator",
      description:
        "Créateur Minecraft - resource packs, mods et modpacks.",
      url: siteUrl,
      siteName: "WoXayZ",
      images: [{ url: og, width: 1200, height: 630 }],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "WoXayZ - Minecraft Creator",
      description:
        "Créateur Minecraft - resource packs, mods et modpacks.",
      images: [og],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="gaming">
      <body
        className={`${poppins.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

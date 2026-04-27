import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { LangProvider } from "@/i18n/LangProvider";
import { DEFAULT_LOCALE, LOCALES, dictionary, type Locale } from "@/i18n/dictionary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieLocale = (await cookies()).get("locale")?.value as Locale | undefined;
  const locale: Locale = cookieLocale && LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const dict = dictionary[locale];
  return {
    metadataBase: new URL("https://100x.lv"),
    title: {
      default: dict["meta.title"],
      template: "%s | 100x.lv",
    },
    description: dict["meta.description"],
    alternates: {
      canonical: "/",
      languages: {
        "lv-LV": "/",
        "en-US": "/",
        "x-default": "/",
      },
    },
    openGraph: {
      title: dict["meta.title"],
      description: dict["meta.description"],
      url: "https://100x.lv",
      siteName: "100x.lv",
      locale: locale === "lv" ? "lv_LV" : "en_US",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict["meta.title"],
      description: dict["meta.description"],
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

import { Toaster } from 'react-hot-toast';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = (await cookies()).get("locale")?.value as Locale | undefined;
  const locale: Locale = cookieLocale && LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} antialiased`}
      >
        <LangProvider initialLocale={locale}>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
          <Toaster position="bottom-center" />
        </LangProvider>
      </body>
    </html>
  );
}

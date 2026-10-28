import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { defaultLocale, getDictionary } from "@/content";
import { I18nProvider } from "@/content/I18nProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const t = getDictionary(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://reacto.tech"),
  title: t.meta.title,
  description: t.meta.description,
  icons: { icon: "/icons/icon-reacto.svg" },
  openGraph: { title: t.meta.title, description: t.meta.description, siteName: "Reacto", locale: "ru_RU", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0a0e15",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className={manrope.variable}>
      <body>
        <I18nProvider locale={defaultLocale}>{children}</I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PERSON_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_URL } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bertha Upegui Galofre | Psicóloga y terapia online en español",
    template: "%s | Bertha Upegui, Psicóloga",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: "Bertha Upegui Galofre, Psicóloga",
  authors: [{ name: PERSON_NAME, url: SITE_URL }],
  creator: PERSON_NAME,
  category: "health",
  alternates: {
    canonical: "/",
    languages: { es: "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Bertha Upegui Galofre, Psicóloga",
    locale: "es_LA",
    alternateLocale: ["es_ES", "es_CO", "es_MX", "es_US"],
    url: "/",
    title: "Bertha Upegui Galofre | Psicóloga y terapia online en español",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bertha Upegui Galofre | Psicóloga y terapia online en español",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = { themeColor: "#7a58bf" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.char__enter{opacity:1!important}`}</style>
        </noscript>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, buildWhatsappUrl } from "@/lib/content";
import { MobileMenu } from "@/components/mobile-menu";
import { NAV_ITEMS } from "@/lib/nav";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const ctaHref =
    settings.bookingMode === "whatsapp"
      ? buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate) ?? "/contacto"
      : "/servicios#agenda";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-purple-100 relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/brand/logo-horizontal.png"
            alt={`${settings.siteName}, psicóloga`}
            width={1401}
            height={296}
            loading="eager"
            className="h-10 sm:h-12 w-auto transition-transform duration-200 group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-700">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-purple-600 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={ctaHref}
          target={settings.bookingMode === "whatsapp" ? "_blank" : undefined}
          rel={settings.bookingMode === "whatsapp" ? "noopener noreferrer" : undefined}
          className="hidden md:inline-flex items-center rounded-full bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-purple-300/40 hover:shadow-lg hover:shadow-purple-400/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          Agendar consulta
        </Link>

        <MobileMenu ctaHref={ctaHref} ctaLabel="Agendar consulta" />
      </div>
    </header>
  );
}

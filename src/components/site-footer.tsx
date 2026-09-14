import Link from "next/link";
import { getSiteSettings, getSocialLinks, getAboutContent, buildWhatsappUrl } from "@/lib/content";
import { Icon, type IconName } from "@/components/icon";
import { NAV_ITEMS } from "@/lib/nav";

const SOCIAL_ICON: Record<string, IconName> = {
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  linkedin: "linkedin",
  whatsapp: "whatsapp",
};

export async function SiteFooter() {
  const [settings, social, about] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(true),
    getAboutContent(),
  ]);

  const ctaHref =
    settings.bookingMode === "whatsapp"
      ? buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate) ?? "/contacto"
      : "/servicios#agenda";

  return (
    <footer className="mt-24 bg-purple-700 text-purple-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-white">{settings.siteName}</p>
          <p className="text-purple-200 text-sm mt-1">{about.title}</p>
          {settings.phoneVisible && settings.phone && (
            <p className="text-purple-200 text-sm mt-3 flex items-center gap-2">
              <Icon name="phone" className="w-4 h-4" /> {settings.phone}
            </p>
          )}
          {settings.contactEmail && (
            <p className="text-purple-200 text-sm mt-1 flex items-center gap-2">
              <Icon name="mail" className="w-4 h-4" /> {settings.contactEmail}
            </p>
          )}
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-purple-100 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div>
          {social.length > 0 && (
            <div className="flex gap-3 mb-5">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-purple-600/60 flex items-center justify-center hover:bg-aqua-500 transition-colors"
                  aria-label={s.platform}
                >
                  <Icon name={SOCIAL_ICON[s.platform] ?? "heart"} className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          )}
          <Link
            href={ctaHref}
            target={settings.bookingMode === "whatsapp" ? "_blank" : undefined}
            rel={settings.bookingMode === "whatsapp" ? "noopener noreferrer" : undefined}
            className="inline-flex items-center rounded-full bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Agendar consulta
          </Link>
        </div>
      </div>

      <div className="border-t border-purple-600/50">
        <p className="max-w-6xl mx-auto px-5 sm:px-8 py-5 text-xs text-purple-200 leading-relaxed">
          {settings.footerLegalText}
        </p>
      </div>
    </footer>
  );
}

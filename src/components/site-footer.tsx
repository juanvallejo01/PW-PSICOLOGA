import Image from "next/image";
import { getSiteSettings, getSocialLinks, getAboutContent, buildWhatsappUrl } from "@/lib/content";
import { Icon, type IconName } from "@/components/icon";

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
    <footer className="bg-gradient-to-br from-purple-700 via-purple-700 to-purple-800 text-purple-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <div>
          {/* El logo es morado: se invierte a blanco para leerse sobre el fondo oscuro */}
          <Image
            src="/brand/logo-vertical.png"
            alt={`${settings.siteName}, psicóloga`}
            width={965}
            height={514}
            className="h-24 w-auto brightness-0 invert"
          />
          <p className="text-purple-200 text-sm mt-3">{about.title}</p>
          {(settings.phoneVisible && settings.phone) || settings.contactEmail ? (
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
              {settings.phoneVisible && settings.phone && (
                <p className="text-purple-200 text-sm flex items-center gap-2">
                  <Icon name="phone" className="w-4 h-4" /> {settings.phone}
                </p>
              )}
              {settings.contactEmail && (
                <p className="text-purple-200 text-sm flex items-center gap-2">
                  <Icon name="mail" className="w-4 h-4" /> {settings.contactEmail}
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-start sm:items-end gap-4">
          {social.length > 0 && (
            <div className="flex gap-3">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-purple-600/60 flex items-center justify-center hover:bg-aqua-500 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  aria-label={s.platform}
                >
                  <Icon name={SOCIAL_ICON[s.platform] ?? "heart"} className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          )}
          <a
            href={ctaHref}
            target={settings.bookingMode === "whatsapp" ? "_blank" : undefined}
            rel={settings.bookingMode === "whatsapp" ? "noopener noreferrer" : undefined}
            className="inline-flex items-center rounded-full bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Agendar consulta
          </a>
        </div>
      </div>

      <div className="border-t border-purple-600/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-purple-300">
          <p className="leading-relaxed max-w-2xl">{settings.footerLegalText}</p>
          <div className="flex flex-col sm:items-end gap-0.5 shrink-0">
            <p>© 2026 Todos los derechos reservados.</p>
            <p>
              Desarrollado por <span className="font-semibold text-purple-100">NBMATES</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

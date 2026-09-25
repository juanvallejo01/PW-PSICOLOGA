import { getAboutContent, getFaqs, getServices, getSiteSettings, getSocialLinks } from "@/lib/content";
import { PERSON_ALTERNATE_NAMES, PERSON_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/site";

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** WebSite + Person + ProfessionalService (con sus servicios) + FAQPage, listos para la home. */
export async function buildHomeJsonLd() {
  const [settings, about, social, faqs, services] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
    getSocialLinks(true),
    getFaqs(true),
    getServices(true),
  ]);

  const sameAs = social.filter((s) => s.platform !== "whatsapp").map((s) => s.url);
  const image = absoluteUrl("/bertha/bertha-11.jpg");
  const personId = absoluteUrl("/#bertha");
  const businessId = absoluteUrl("/#consulta");

  const person = {
    "@type": "Person",
    "@id": personId,
    name: PERSON_NAME,
    alternateName: PERSON_ALTERNATE_NAMES,
    jobTitle: about.title,
    description: stripHtml(about.bioHtml).slice(0, 300),
    image,
    url: absoluteUrl("/sobre-mi"),
    knowsLanguage: "es",
    knowsAbout: ["Psicología", "Psicoterapia", "Terapia online", "Terapia de pareja", "Terapia familiar", "Bienestar emocional", "Migración y adaptación"],
    ...(sameAs.length ? { sameAs } : {}),
  };

  const business = {
    "@type": ["ProfessionalService", "MedicalBusiness"],
    "@id": businessId,
    name: `${PERSON_NAME}, Psicóloga`,
    alternateName: PERSON_ALTERNATE_NAMES,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    image,
    logo: absoluteUrl("/brand/logo-vertical.png"),
    founder: { "@id": personId },
    areaServed: "Worldwide",
    availableLanguage: { "@type": "Language", name: "Spanish", alternateName: "es" },
    serviceType: ["Terapia psicológica online", "Psicoterapia", "Terapia de pareja", "Terapia familiar", "Terapia infantil y adolescente"],
    ...(settings.phoneVisible && settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios",
            itemListElement: services.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.name, description: s.description.replace(/^[#•]\s*/gm, "").replace(/\n+/g, " ").slice(0, 300) },
              ...(s.priceUsd || s.priceCop
                ? {
                    priceSpecification: [
                      s.priceUsd && { "@type": "PriceSpecification", price: s.priceUsd, priceCurrency: "USD" },
                      s.priceCop && { "@type": "PriceSpecification", price: s.priceCop, priceCurrency: "COP" },
                    ].filter(Boolean),
                  }
                : {}),
            })),
          },
        }
      : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: `${PERSON_NAME}, Psicóloga`,
    inLanguage: "es",
    publisher: { "@id": businessId },
  };

  const graph: Record<string, unknown>[] = [website, person, business];
  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.slice(0, 10).map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

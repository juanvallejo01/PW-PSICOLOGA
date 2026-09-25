/**
 * Dominio público del sitio. Configúralo con NEXT_PUBLIC_SITE_URL (ej. https://www.tudominio.com)
 * en el hosting: sitemap, canonicals, Open Graph y datos estructurados se generan a partir de él.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const PERSON_NAME = "Bertha Cecilia Upegui Galofre";
export const PERSON_ALTERNATE_NAMES = ["Bertha Upegui", "Bertha Cecilia Upegui", "Bertha Upegui Galofre", "Psi. Bertha Upegui"];

export const SITE_DESCRIPTION =
  "Bertha Upegui Galofre, psicóloga terapeuta. Terapia psicológica online en español para adultos, jóvenes, niños, parejas y familias, desde cualquier país. Agenda tu primera sesión por WhatsApp.";

export const SITE_KEYWORDS = [
  "psicóloga",
  "psicóloga online",
  "terapia online",
  "terapia psicológica online",
  "terapia en español",
  "psicóloga en español",
  "psicoterapia online",
  "terapeuta",
  "terapia de pareja online",
  "terapia familiar online",
  "terapia para adultos",
  "terapia para jóvenes",
  "terapia infantil online",
  "ansiedad",
  "depresión",
  "duelo",
  "migración y adaptación",
  "psicóloga para latinos en el exterior",
  "psicóloga para hispanos",
  "Bertha Upegui",
  "Bertha Cecilia Upegui",
  "Bertha Upegui Galofre",
  "Spanish-speaking psychologist",
  "online therapy in Spanish",
  "Spanish speaking therapist online",
];

/** URL absoluta a partir de una ruta relativa. */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

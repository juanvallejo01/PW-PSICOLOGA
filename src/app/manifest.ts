import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bertha Upegui Galofre — Psicóloga",
    short_name: "Bertha Upegui",
    description: "Terapia psicológica online en español.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfbfd",
    theme_color: "#7a58bf",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}

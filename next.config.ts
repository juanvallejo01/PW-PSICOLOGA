import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El PDF del regalo vive en /private y se lee con fs en runtime: se incluye explícitamente en el despliegue.
  outputFileTracingIncludes: {
    "/api/regalo/descargar": ["./private/**/*"],
  },
};

export default nextConfig;

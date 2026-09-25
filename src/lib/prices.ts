/**
 * Precios de los servicios en dos monedas: dólares estadounidenses (USD) y pesos colombianos (COP).
 * En la base se guardan como texto con solo el número ("90", "90.5", "250000"); aquí se normaliza
 * lo que escribe el admin y se formatea para mostrarlo.
 */
export type Currency = "USD" | "COP";

/** "$ 90,50" → "90.5"; "250.000" → "250000". Devuelve null si está vacío o no es un número válido. */
export function normalizePrice(raw: string, currency: Currency): string | null {
  const cleaned = raw.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;
  let value: number;
  if (currency === "COP") {
    // Pesos sin centavos: puntos y comas son separadores de miles.
    value = Number(cleaned.replace(/[.,]/g, ""));
  } else {
    // USD: la última coma o punto con 1–2 dígitos después son decimales; el resto, miles.
    const m = cleaned.match(/^(.*?)[.,](\d{1,2})$/);
    value = m ? Number(`${m[1].replace(/[.,]/g, "")}.${m[2]}`) : Number(cleaned.replace(/[.,]/g, ""));
  }
  return Number.isFinite(value) && value > 0 ? String(value) : null;
}

export function formatPrice(value: string | null | undefined, currency: Currency): string | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return `${value} ${currency}`;
  const formatted =
    currency === "COP"
      ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n)
      : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n);
  return `${formatted} ${currency}`;
}

/** Monto en la unidad mínima que exige Stripe (centavos). USD y COP son monedas de dos decimales en Stripe. */
export function toMinorUnits(value: string): number {
  return Math.round(Number(value) * 100);
}

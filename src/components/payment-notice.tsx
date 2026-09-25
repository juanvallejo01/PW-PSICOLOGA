"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const MESSAGES: Record<string, { tone: "info" | "warn"; text: string }> = {
  pendiente: {
    tone: "info",
    text: "El pago en línea estará disponible muy pronto. Mientras tanto puedes agendar y coordinar el pago por WhatsApp.",
  },
  cancelado: { tone: "info", text: "Cancelaste el pago, no se hizo ningún cobro. Cuando quieras puedes intentarlo de nuevo." },
  error: { tone: "warn", text: "No pudimos iniciar el pago. Inténtalo de nuevo o escríbeme por WhatsApp y lo resolvemos." },
};

function Notice({ whatsappHref }: { whatsappHref: string | null }) {
  const key = useSearchParams().get("pago");
  const msg = key ? MESSAGES[key] : null;
  if (!msg) return null;
  return (
    <div
      role="status"
      className={`mb-8 rounded-2xl border px-5 py-4 text-sm leading-relaxed ${
        msg.tone === "warn" ? "border-pink-300 bg-pink-100 text-ink-900" : "border-aqua-300 bg-aqua-100 text-ink-900"
      }`}
    >
      {msg.text}{" "}
      {whatsappHref && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-700 underline">
          Escribir por WhatsApp
        </a>
      )}
    </div>
  );
}

/** Aviso según el resultado del pago (`?pago=`). Va dentro de Suspense para no volver dinámica toda la página. */
export function PaymentNotice({ whatsappHref }: { whatsappHref: string | null }) {
  return (
    <Suspense fallback={null}>
      <Notice whatsappHref={whatsappHref} />
    </Suspense>
  );
}

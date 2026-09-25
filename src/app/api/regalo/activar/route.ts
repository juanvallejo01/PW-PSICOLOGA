import { NextResponse, type NextRequest } from "next/server";
import { GIFT_COOKIE, giftCookieOptions, signGiftToken } from "@/lib/gift";
import { getCheckoutSummary, isStripeConfigured } from "@/lib/stripe";

/**
 * Desbloquea el regalo tras un pago. Stripe redirige aquí al terminar el pago; se verifica con la API
 * que la sesión esté realmente pagada (nunca se confía en la URL) y se guarda la cookie de acceso.
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id") ?? "";
  const destino = request.nextUrl.searchParams.get("destino");
  const summary = isStripeConfigured() ? await getCheckoutSummary(sessionId) : null;

  const target =
    destino === "exito" && summary
      ? `/pago/exito?session_id=${encodeURIComponent(sessionId)}`
      : summary?.paid
        ? "/diario-de-gratitud?activado=1"
        : "/diario-de-gratitud?estado=no-pagado";

  const response = NextResponse.redirect(new URL(target, request.url));
  if (summary?.paid) {
    response.cookies.set(GIFT_COOKIE, await signGiftToken(sessionId), giftCookieOptions());
  }
  return response;
}

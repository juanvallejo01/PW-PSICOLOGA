import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Acceso al regalo (Diario de la Gratitud). Se concede cuando Stripe confirma el pago de una sesión y
 * se recuerda en una cookie firmada (HTTP-only) de un año. El PDF vive en /private, fuera de /public,
 * y solo se sirve desde /api/regalo/descargar si la cookie es válida.
 */
export const GIFT_COOKIE = "regalo_diario";
export const GIFT_TTL_SECONDS = 60 * 60 * 24 * 365;
const AUDIENCE = "regalo-diario";

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Falta SESSION_SECRET en las variables de entorno");
  return new TextEncoder().encode(secret);
}

/** Token firmado que guarda la sesión de pago que dio origen al acceso. */
export async function signGiftToken(checkoutSessionId: string) {
  return new SignJWT({ sid: checkoutSessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${GIFT_TTL_SECONDS}s`)
    .sign(key());
}

export const giftCookieOptions = () =>
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GIFT_TTL_SECONDS,
  }) as const;

export async function isValidGiftToken(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, key(), { audience: AUDIENCE });
    return true;
  } catch {
    return false;
  }
}

/** ¿La persona que visita ya desbloqueó el regalo? */
export async function hasGiftAccess() {
  const store = await cookies();
  return isValidGiftToken(store.get(GIFT_COOKIE)?.value);
}

import { SignJWT, jwtVerify } from "jose";

// Módulo mínimo sin dependencias de next/headers ni "server-only" para
// poder usarse tanto en Server Components / Actions como en proxy.ts.

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta SESSION_SECRET en las variables de entorno");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

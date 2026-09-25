"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { GIFT_COOKIE, giftCookieOptions, signGiftToken } from "@/lib/gift";
import { findPaidSessionIdByEmail, isStripeConfigured } from "@/lib/stripe";

const emailSchema = z.string().trim().email();

/** Recupera el regalo en otro dispositivo con el correo que se usó al pagar. */
export async function recoverGiftAction(formData: FormData) {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) redirect("/diario-de-gratitud?estado=correo-invalido#recuperar");

  const sessionId = isStripeConfigured() ? await findPaidSessionIdByEmail(parsed.data) : null;
  if (!sessionId) redirect("/diario-de-gratitud?estado=no-encontrado#recuperar");

  (await cookies()).set(GIFT_COOKIE, await signGiftToken(sessionId), giftCookieOptions());
  redirect("/diario-de-gratitud?activado=1");
}

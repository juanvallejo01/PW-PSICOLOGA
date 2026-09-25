"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe";

/**
 * Inicia el pago de un servicio. El precio SIEMPRE se lee de la base de datos: del formulario
 * solo llegan el servicio y la moneda, así nadie puede alterar el monto.
 */
export async function startCheckoutAction(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "");
  const currency = formData.get("currency") === "COP" ? "COP" : "USD";

  const service = await prisma.service.findFirst({ where: { id: serviceId, active: true } });
  const price = currency === "USD" ? service?.priceUsd : service?.priceCop;
  if (!service || !price) redirect("/servicios?pago=error");

  if (!isStripeConfigured()) redirect("/servicios?pago=pendiente");

  let url: string | null = null;
  try {
    url = await createCheckoutSession({ serviceId: service.id, serviceName: service.name, price, currency });
  } catch (err) {
    console.error("[checkout] no se pudo crear la sesión de pago", err);
  }
  redirect(url ?? "/servicios?pago=error");
}

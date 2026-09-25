import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { GIFT_COOKIE, isValidGiftToken } from "@/lib/gift";

/** Sirve el PDF del regalo solo a quien tiene la cookie de acceso. `?ver=1` lo abre en el navegador. */
export async function GET(request: NextRequest) {
  if (!(await isValidGiftToken(request.cookies.get(GIFT_COOKIE)?.value))) {
    return NextResponse.redirect(new URL("/diario-de-gratitud?estado=bloqueado", request.url));
  }

  const file = await readFile(path.join(process.cwd(), "private", "diario-de-gratitud.pdf"));
  const inline = request.nextUrl.searchParams.get("ver") === "1";
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="Diario-de-la-Gratitud-Bertha-Upegui.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

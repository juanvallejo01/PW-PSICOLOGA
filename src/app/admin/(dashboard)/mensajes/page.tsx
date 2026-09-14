import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminHeading, AdminCard, DeleteButton } from "@/components/admin/ui";
import { markMessageReadAction, deleteMessageAction } from "./actions";

export const metadata: Metadata = { title: "Mensajes de contacto" };

export default async function AdminMensajesPage() {
  const messages = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <AdminHeading title="Mensajes de contacto" subtitle="Enviados desde el formulario de la página de Contacto." />

      <div className="space-y-3">
        {messages.map((m) => (
          <AdminCard key={m.id} className={!m.read ? "border-purple-300" : ""}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink-900">
                  {m.name} {!m.read && <span className="ml-2 text-xs bg-aqua-100 text-aqua-600 px-2 py-0.5 rounded-full">Nuevo</span>}
                </p>
                <p className="text-sm text-purple-600">{m.email}</p>
                <p className="text-xs text-ink-500 mt-1">
                  {m.createdAt.toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <form action={markMessageReadAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={String(m.read)} />
                  <button type="submit" className="text-xs text-purple-600 underline">
                    {m.read ? "Marcar no leído" : "Marcar leído"}
                  </button>
                </form>
                <form action={deleteMessageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <DeleteButton>Eliminar</DeleteButton>
                </form>
              </div>
            </div>
            <p className="text-sm text-ink-700 mt-3 leading-relaxed whitespace-pre-wrap">{m.message}</p>
          </AdminCard>
        ))}
        {messages.length === 0 && <p className="text-sm text-ink-500">Todavía no llegaron mensajes.</p>}
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminHeading, AdminCard } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Panel admin" };

export default async function AdminHomePage() {
  const [unreadMessages, totalMessages, publishedPosts, draftPosts, pendingTestimonials] = await Promise.all([
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.contactSubmission.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { published: false } }),
    prisma.testimonial.count({ where: { published: false } }),
  ]);

  return (
    <div>
      <AdminHeading title="Resumen" subtitle="Estado general del contenido del sitio." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Mensajes sin leer" value={unreadMessages} href="/admin/mensajes" />
        <StatCard label="Mensajes totales" value={totalMessages} href="/admin/mensajes" />
        <StatCard label="Entradas de blog publicadas" value={publishedPosts} href="/admin/blog" />
        <StatCard label="Borradores de blog" value={draftPosts} href="/admin/blog" />
      </div>

      <AdminCard>
        <p className="font-semibold text-ink-900 mb-2">Bienvenida</p>
        <p className="text-sm text-ink-500 leading-relaxed">
          Desde el menú de la izquierda podés actualizar todo el contenido del sitio: blog,
          disponibilidad, testimonios, preguntas frecuentes, precios, métodos de pago, tu
          presentación y los datos de contacto. Los cambios se publican de inmediato, sin
          necesidad de un desarrollador.
        </p>
        {pendingTestimonials > 0 && (
          <p className="text-sm text-purple-600 mt-3">
            Tenés {pendingTestimonials} testimonio(s) guardado(s) sin publicar en{" "}
            <Link href="/admin/testimonios" className="underline">
              Testimonios
            </Link>
            .
          </p>
        )}
      </AdminCard>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="block">
      <AdminCard className="hover:border-purple-300 transition-colors">
        <p className="text-3xl font-display font-semibold text-purple-700">{value}</p>
        <p className="text-sm text-ink-500 mt-1">{label}</p>
      </AdminCard>
    </Link>
  );
}

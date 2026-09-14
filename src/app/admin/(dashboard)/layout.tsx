import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { logoutAction } from "./actions";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-purple-50/40 flex flex-col lg:flex-row">
      <aside className="lg:w-64 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-purple-100">
        <div className="px-5 py-5 border-b border-purple-100 flex items-center justify-between">
          <Link href="/admin" className="font-display font-semibold text-purple-700">
            Panel admin
          </Link>
          <Link href="/" target="_blank" className="text-xs text-ink-500 hover:text-purple-600">
            Ver sitio ↗
          </Link>
        </div>
        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible text-sm">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-ink-700 hover:bg-purple-100 hover:text-purple-700 whitespace-nowrap transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="p-3 border-t border-purple-100 hidden lg:block">
          <button type="submit" className="text-sm text-pink-500 hover:text-pink-600 px-3 py-2">
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="flex-1 min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  );
}

import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "Ingresar al panel" };

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const hasError = searchParams.error === "1";
  const next = typeof searchParams.next === "string" ? searchParams.next : "/admin";

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-purple-100 shadow-sm p-8">
        <p className="font-display text-xl font-semibold text-purple-700 text-center">Panel privado</p>
        <p className="text-sm text-ink-500 text-center mt-1 mb-6">Acceso solo para administración del sitio</p>

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          {hasError && (
            <p className="text-sm text-pink-500 bg-pink-100 rounded-lg px-3 py-2">
              Email o contraseña incorrectos.
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              className="w-full rounded-lg border border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-purple-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 text-sm transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

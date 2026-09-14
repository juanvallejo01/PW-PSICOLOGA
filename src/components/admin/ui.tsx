import type { ReactNode } from "react";
import Link from "next/link";

export function AdminHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold text-ink-900">{title}</h1>
      {subtitle && <p className="text-sm text-ink-500 mt-1 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function AdminCard({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl bg-white border border-purple-100 p-6 ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-700 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-purple-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 3,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-700 mb-1">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        required={required}
        className="w-full rounded-lg border border-purple-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
      />
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-700">
      <input
        type="checkbox"
        name={name}
        value="on"
        defaultChecked={defaultChecked}
        className="rounded border-purple-300 text-purple-600 focus:ring-purple-300"
      />
      {label}
    </label>
  );
}

export function ButtonLinkAdmin({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
    >
      {children}
    </Link>
  );
}

export function SaveButton({ children = "Guardar" }: { children?: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
    >
      {children}
    </button>
  );
}

export function DeleteButton({ children = "Eliminar" }: { children?: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center rounded-full bg-pink-100 hover:bg-pink-300 text-pink-500 hover:text-white font-medium px-4 py-2 text-xs transition-colors"
    >
      {children}
    </button>
  );
}

export function ImageField({
  label,
  name,
  currentUrl,
}: {
  label: string;
  name: string;
  currentUrl?: string | null;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-700 mb-1">{label}</span>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt="" className="w-28 h-28 object-cover rounded-xl mb-2 border border-purple-100" />
      )}
      <input
        name={name}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="block w-full text-sm text-ink-500 file:mr-3 file:rounded-full file:border-0 file:bg-purple-100 file:text-purple-700 file:px-4 file:py-2 file:text-sm file:font-medium"
      />
    </label>
  );
}

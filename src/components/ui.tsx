import type { ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`max-w-6xl mx-auto px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-block text-xs font-semibold tracking-wide uppercase text-aqua-600 bg-aqua-100 rounded-full px-3 py-1">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-10`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-ink-900">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-500 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0";
  const variants: Record<string, string> = {
    primary: "bg-purple-500 hover:bg-purple-600 text-white shadow-md shadow-purple-300/40 hover:shadow-lg hover:shadow-purple-400/40",
    secondary: "bg-aqua-500 hover:bg-aqua-600 text-white shadow-md shadow-aqua-300/40 hover:shadow-lg hover:shadow-aqua-400/40",
    ghost: "bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300",
  };
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl bg-white border border-purple-100 shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-200/50 hover:border-purple-200 ${className}`}
    >
      {children}
    </div>
  );
}

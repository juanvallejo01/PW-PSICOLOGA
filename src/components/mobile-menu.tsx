"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { NAV_ITEMS } from "@/lib/nav";

export function MobileMenu({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 -mr-2 text-purple-700"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        <Icon name={open ? "close" : "menu"} className="w-7 h-7" />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full bg-white border-t border-purple-100 shadow-lg px-6 py-6 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-ink-900 font-medium text-base"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex justify-center items-center rounded-full bg-purple-500 text-white px-5 py-3 font-semibold"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

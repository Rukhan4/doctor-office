"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
    { href: "/packages", label: "Packages" },
  { href: "/doctors", label: "Our Team" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[rgba(244,241,234,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold tracking-wide text-ink">
          Doctor&apos;s Office Curepe
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line px-4 pb-4 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 pt-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-3 py-2 text-sm font-medium ${active ? "bg-accentSoft text-ink" : "text-muted"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
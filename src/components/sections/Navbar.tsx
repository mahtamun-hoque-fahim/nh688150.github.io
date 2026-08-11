"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";

const links = [
  { href: "/products", label: "Product" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${
        scrolled || menuOpen
          ? "border-b border-border bg-bg/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.03)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Falcotrix"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="text-lg font-semibold tracking-tight">Falcotrix</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-text-muted transition-colors duration-150 hover:text-text"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/#download"
            className="hidden items-center gap-2 rounded-none bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-accent-hover hover:shadow-[0_0_0_1px_var(--color-accent-hover),0_0_20px_var(--color-accent-faint)] sm:inline-flex"
          >
            <Download className="h-4 w-4" strokeWidth={2.25} />
            Download
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-none border border-border bg-surface p-2.5 text-text transition-colors duration-150 hover:border-border-strong md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-border px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-base text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 sm:hidden">
              <Link
                href="/#download"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-none bg-accent px-4 py-3 text-sm font-semibold text-white"
              >
                <Download className="h-4 w-4" strokeWidth={2.25} />
                Download
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

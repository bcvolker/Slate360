'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/subscribe", label: "Subscribe" },
];

export default function CleanHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-slate360-slate dark:bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/globe.svg" alt="Slate360 Logo" width={48} height={48} priority />
          <span className="font-orbitron text-3xl tracking-widest font-bold text-slate360-blue drop-shadow-lg">Slate360</span>
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-inter text-lg px-3 py-2 rounded hover:bg-slate360-blue/20 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          className="md:hidden flex items-center p-2 rounded hover:bg-slate360-blue/20 focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden bg-slate360-slate dark:bg-slate-900 px-4 pb-4 transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
        style={{ boxShadow: mobileOpen ? "0 4px 12px rgba(0,0,0,0.08)" : undefined }}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-inter text-lg px-3 py-2 rounded hover:bg-slate360-blue/20 transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
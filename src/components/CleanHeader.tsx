"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function CleanHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About' },
    { href: '/subscribe', label: 'Subscribe' },
    { href: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 h-24 flex items-center px-6">
      <Link href="/" className="text-4xl font-bold text-slate360-blue drop-shadow-md font-orbitron">Slate360</Link>
      <nav className="ml-auto hidden md:flex gap-6 text-sm text-slate-300">
        {navLinks.map(link => (
          <Link key={link.label} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
        ))}
      </nav>
      <button className="md:hidden ml-auto p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X className="h-6 w-6 text-white"/> : <Menu className="h-6 w-6 text-white" />}
      </button>
      {isOpen && (
        <nav className="absolute top-24 left-0 right-0 bg-slate-900/95 flex flex-col gap-6 p-8 md:hidden shadow-xl">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="text-lg text-slate-200">{link.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
// ...existing code ends above...
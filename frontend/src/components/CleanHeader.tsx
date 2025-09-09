'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';

export default function CleanHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'backdrop-blur-lg bg-zinc-950/80 border-b border-zinc-800 shadow-sm'
        : 'backdrop-blur-sm bg-zinc-950/40 border-b border-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Ensure your logo is at this path */}
          <Image src="/slate360-logo.png" alt="Slate360" width={150} height={36} priority />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/contact" className="text-zinc-300 hover:text-zinc-100 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50">
            Contact
          </Link>
          <Link href="/about" className="text-zinc-300 hover:text-zinc-100 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50">
            About
          </Link>
          <Link href="/pricing" className="text-zinc-300 hover:text-zinc-100 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50">
            Subscribe
          </Link>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-white px-4 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--brand-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-accent)'}>
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-white px-3 py-2 rounded-lg font-medium text-sm" style={{ backgroundColor: 'var(--brand-accent)' }}>
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

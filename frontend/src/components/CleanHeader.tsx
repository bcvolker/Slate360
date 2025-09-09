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
        ? 'backdrop-blur-lg bg-white/80 border-b border-zinc-200 shadow-sm'
        : 'backdrop-blur-sm bg-white/40 border-b border-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Ensure your logo is at this path */}
          <Image src="/slate360-logo.png" alt="Slate360" width={150} height={36} priority />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard" className="text-zinc-700 hover:text-zinc-900 transition-colors">Dashboard</Link>
          <Link href="/bim" className="text-zinc-700 hover:text-zinc-900 transition-colors">BIM Studio</Link>
          <Link href="/reports" className="text-zinc-700 hover:text-zinc-900 transition-colors">Reports</Link>
          <Link href="/ceo" className="text-zinc-700 hover:text-zinc-900 transition-colors">CEO</Link>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-900 transition-colors">
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

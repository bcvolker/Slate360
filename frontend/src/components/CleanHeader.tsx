'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LogIn, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function CleanHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'backdrop-blur-lg bg-background/80 border-b border-border shadow-sm'
        : 'backdrop-blur-sm bg-background/40 border-b border-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/slate360-logo.png" alt="Slate360" width={150} height={36} priority />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/contact" className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent">
            Contact
          </Link>
          <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent">
            About
          </Link>
          <Link href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent">
            Subscribe
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90">
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg font-medium text-sm">
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

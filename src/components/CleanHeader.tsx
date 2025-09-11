'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function CleanHeader() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Logo - Left side */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/slate360 logo.PNG"
            alt="Slate360 Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation - Right side */}
        <nav className="flex items-center space-x-6">
          <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/subscribe" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Subscribe
          </Link>
          <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Login
          </Link>
          <button
            onClick={handleThemeToggle}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Toggle Theme"
          >
            <Sun className="h-4 w-4 text-foreground" />
            <Moon className="h-4 w-4 text-foreground absolute opacity-0" />
          </button>
        </nav>
      </div>
    </header>
  );
}
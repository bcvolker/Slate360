'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function CleanHeader() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="flex h-20 items-center justify-between px-6 py-2">
        {/* Logo - Left side */}
        <Link href="/" className="logo-link">
          <img
            src="/slate360-logo.png"
            alt="Slate360 Logo"
            className="logo-image"
          />
        </Link>

        {/* Navigation - Right side */}
        <nav className="flex items-center space-x-6">
          <Link href="/contact" className="nav-link">
            <span className="text-white hover:text-gray-300 transition-colors">CONTACT</span>
          </Link>
          <Link href="/about" className="nav-link">
            <span className="text-white hover:text-gray-300 transition-colors">ABOUT</span>
          </Link>
          <Link href="/subscribe" className="nav-link">
            <span className="text-white hover:text-gray-300 transition-colors">SUBSCRIBE</span>
          </Link>
          <Link href="/login" className="nav-link">
            <span className="text-white hover:text-gray-300 transition-colors">LOGIN</span>
          </Link>
          <button
            onClick={handleThemeToggle}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            <Sun className="theme-icon sun-icon" />
            <Moon className="theme-icon moon-icon" />
          </button>
        </nav>
      </div>
    </header>
  );
}
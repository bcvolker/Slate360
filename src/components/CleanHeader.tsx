'use client';

import Link from 'next/link';
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
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo - Left side */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="logo-icon">
              <rect width="256" height="256" fill="none"></rect>
              <path d="M48,216a23.9,23.9,0,0,1,24-24H208V88a23.9,23.9,0,0,0-24-24H72a23.9,23.9,0,0,0-24,24Z" opacity="0.2"></path>
              <path d="M48,216a23.9,23.9,0,0,1,24-24H208V88a23.9,23.9,0,0,0-24-24H72a23.9,23.9,0,0,0-24,24Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
              <polyline points="48 88 48 40 208 40 208 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline>
            </svg>
          </div>
          <span className="logo-text font-bold text-white">SLATE360</span>
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
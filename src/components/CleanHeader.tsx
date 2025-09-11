'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CleanHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About' },
    { href: '/subscribe', label: 'Subscribe' },
    { href: '/login', label: 'Login' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-24 flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <svg role="img" aria-label="Slate360 Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-12 w-auto">
            <rect width="256" height="256" fill="none"></rect>
            <path d="M48,216a23.9,23.9,0,0,1,24-24H208V88a23.9,23.9,0,0,0-24-24H72a23.9,23.9,0,0,0-24,24Z" className="fill-primary opacity-20"></path>
            <path d="M48,216a23.9,23.9,0,0,1,24-24H208V88a23.9,23.9,0,0,0-24-24H72a23.9,23.9,0,0,0-24,24Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
            <polyline points="48 88 48 40 208 40 208 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline>
          </svg>
          <span className="text-2xl font-bold font-orbitron hidden sm:inline-block">Slate360</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost">{link.label}</Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" aria-label="Open menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        className={`md:hidden absolute top-24 left-0 w-full bg-background shadow-lg ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <nav className="flex flex-col items-center gap-6 py-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
              <span className="text-lg font-medium hover:text-primary">{link.label}</span>
            </Link>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
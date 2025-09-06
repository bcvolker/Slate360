'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogIn } from 'lucide-react';

interface CleanHeaderProps {
  className?: string;
}

export default function CleanHeader({ className = '' }: CleanHeaderProps) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Clickable to homepage */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image 
                src="/slate360-logo.png" 
                alt="Slate360 Logo" 
                width={360} 
                height={100} 
                priority 
                className="h-24 w-auto"
              />
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/contact" className="text-black hover:text-gray-700 transition-colors font-semibold text-lg">
              CONTACT
            </Link>
            <Link href="/about" className="text-black hover:text-gray-700 transition-colors font-semibold text-lg">
              ABOUT
            </Link>
            <Link href="/pricing" className="text-black hover:text-gray-700 transition-colors font-semibold text-lg">
              SUBSCRIBE
            </Link>
            <Link href="/login" className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors font-semibold text-lg">
              <LogIn className="w-5 h-5" />
              <span>LOGIN</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/login" className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors font-semibold">
              <LogIn className="w-5 h-5" />
              <span>LOGIN</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

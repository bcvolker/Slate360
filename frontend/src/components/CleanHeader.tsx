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
                width={240} 
                height={67} 
                priority 
                className="h-16 w-auto"
              />
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/contact" className="text-gray-900 hover:text-gray-600 transition-colors font-medium">
              CONTACT
            </Link>
            <Link href="/about" className="text-gray-900 hover:text-gray-600 transition-colors font-medium">
              ABOUT
            </Link>
            <Link href="/pricing" className="text-gray-900 hover:text-gray-600 transition-colors font-medium">
              SUBSCRIBE
            </Link>
            <Link href="/login" className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors font-medium">
              <LogIn className="w-4 h-4" />
              <span>LOGIN</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/login" className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors">
              <LogIn className="w-4 h-4" />
              <span>LOGIN</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

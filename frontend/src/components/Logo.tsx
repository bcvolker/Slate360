'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: number;
  showText?: boolean;
  clickable?: boolean;
}

export default function Logo({ size = 64, showText = false, clickable = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const logoContent = (
    <div 
      className="rounded-lg flex items-center justify-center overflow-hidden"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
    >
      {!imageError ? (
        <Image
          src="/slate360-logo.png"
          alt="Slate360 Logo"
          width={size}
          height={size}
          className="w-full h-full object-cover"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            minWidth: `${size}px`,
            minHeight: `${size}px`
          }}
        >
          <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
            S
          </span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

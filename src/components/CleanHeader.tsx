// frontend/src/components/CleanHeader.tsx
'use client';
import React from 'react';

export const CleanHeader = () => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-full">
        <span className="font-bold text-lg">SLATE360</span>
      </div>
    </header>
  );
};
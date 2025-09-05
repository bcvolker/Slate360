'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import CleanHeader from '@/components/CleanHeader';

interface SimpleAppShellProps {
  children: React.ReactNode;
}

const SimpleAppShell: React.FC<SimpleAppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <div className={`min-h-screen ${isHomepage ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Clean Header */}
      <CleanHeader />
      
      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default SimpleAppShell;

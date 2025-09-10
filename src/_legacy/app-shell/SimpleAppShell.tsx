'use client';

import React from 'react';
import CleanHeader from '@/components/CleanHeader';

interface SimpleAppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const SimpleAppShell: React.FC<SimpleAppShellProps> = ({ children, header }) => {
  return (
    <div className="min-h-screen">
      {/* Clean Header */}
      {header || <CleanHeader />}
      
      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default SimpleAppShell;

// frontend/src/components/ui/SurfaceCard.tsx
import React from 'react';

export const SurfaceCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white border rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
};
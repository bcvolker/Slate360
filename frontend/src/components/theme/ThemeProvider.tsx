'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  // The type for props is complex, so we'll use 'any' for this placeholder.
  return <NextThemesProvider {...(props as any)}>{children}</NextThemesProvider>;
}
// frontend/src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SimpleAppShell from '@/app-shell/SimpleAppShell';
import Providers from '@/app-shell/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SLATE360',
  description: 'The All-In-One Platform for the Built World.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SimpleAppShell>
            {children}
          </SimpleAppShell>
        </Providers>
      </body>
    </html>
  );
}

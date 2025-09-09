// frontend/src/app/layout.tsx
import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SimpleAppShell from '@/app-shell/SimpleAppShell';
import CleanHeader from '@/components/CleanHeader';
import DotNav from '@/components/DotNav';
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
      {/* These classes will ensure the dark gradient is the base layer */}
      <body className={`${inter.className} bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-300`}>
        <Providers>
          <SimpleAppShell header={<CleanHeader />}>
            {children}
          </SimpleAppShell>
        </Providers>
        <DotNav />
      </body>
    </html>
  );
}
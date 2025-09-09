// src/app/layout.tsx
import './globals.css';
import CleanHeader from '@/components/CleanHeader';
import Footer from '@/components/Footer';
import DotNav from '@/components/DotNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className="bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-300">
        <CleanHeader />
        <main>{children}</main>
        <DotNav />
        <Footer />
      </body>
    </html>
  );
}
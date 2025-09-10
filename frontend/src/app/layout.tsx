// src/app/layout.tsx
import './globals.css';
import CleanHeader from '@/components/CleanHeader';
import Footer from '@/components/Footer';
import DotNav from '@/components/DotNav';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CleanHeader />
          <main>{children}</main>
          <DotNav />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
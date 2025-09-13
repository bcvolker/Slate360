import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slate360',
  description: 'SaaS for the built environment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

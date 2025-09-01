import './globals.css';
import Header from '@/components/layout/Header';

export const metadata = { title: 'SLATE360', description: 'The future of construction technology.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

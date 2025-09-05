import './globals.css';
import Providers from '@/app-shell/Providers';
import AppShell from '@/app-shell/AppShell';

export const metadata = { title: 'SLATE360', description: 'The future of construction technology.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}

import './globals.css';
import Providers from '@/app-shell/Providers';
import SimpleAppShell from '@/app-shell/SimpleAppShell';

export const metadata = { title: 'SLATE360', description: 'The future of construction technology.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <SimpleAppShell>
            {children}
          </SimpleAppShell>
        </Providers>
      </body>
    </html>
  );
}

import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { name: '360 Viewer', href: '#viewer' },
  { name: 'BIM Models', href: '#bim' },
  { name: 'Content', href: '#content' },
  // CEO tab will be conditionally rendered
];

export function HomeHeader({ showCeoTab = false }: { showCeoTab?: boolean }) {
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <Link href="/">
        <span className="flex items-center gap-2 cursor-pointer">
          <Image src="/globe.svg" alt="Slate360 Logo" width={40} height={40} />
          <span className="text-2xl font-orbitron font-bold text-slate360-blue">Slate360</span>
        </span>
      </Link>
      <nav className="flex gap-4">
        {navLinks.map(link => (
          <a key={link.name} href={link.href} className="text-slate360-blue hover:text-slate360-copper font-semibold transition">
            {link.name}
          </a>
        ))}
        {showCeoTab && (
          <a href="#ceo" className="text-slate360-copper font-semibold transition">CEO</a>
        )}
      </nav>
    </header>
  );
}

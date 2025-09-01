import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="slate360-header p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Image src="/slate360-logo.png" alt="Slate360 Logo" width={180} height={50} priority />
        <nav className="slate360-navigation hidden md:flex gap-8 text-md font-medium items-center">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

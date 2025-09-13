'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CleanHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-orbitron text-primary">
          Slate360
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/about"><Button variant="ghost">About</Button></Link>
          <Link href="/contact"><Button variant="ghost">Contact</Button></Link>
          <Link href="/dashboard"><Button>Dashboard</Button></Link>
        </nav>
      </div>
    </header>
  );
}
// ...existing code ends above...
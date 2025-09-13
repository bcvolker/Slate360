"use client";
import * as React from "react";
import Link from "next/link";
import Logo from "./Logo";

const linkCx =
  "text-sm md:text-base text-[#2F4F4F] hover:text-[#B87333] transition-colors";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-black/5">
      <nav className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between">
        <Logo className="text-xl md:text-2xl" />
        <div className="flex items-center gap-6">
          <Link href="/about" className={linkCx}>About</Link>
          <Link href="/contact" className={linkCx}>Contact</Link>
          <Link href="/subscribe" className={linkCx}>Subscribe</Link>
          <Link href="/(auth)/login" className={linkCx}>Login</Link>
        </div>
      </nav>
    </header>
  );
}

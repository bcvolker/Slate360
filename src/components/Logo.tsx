"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-bold tracking-tight",
        "text-[#4B9CD3] hover:text-[#B87333] transition-colors",
        className
      )}
      aria-label="Slate360 Home"
    >
      Slate<span className="text-[#B87333]">360</span>
    </Link>
  );
}

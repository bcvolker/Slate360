import React from 'react';
import Image from 'next/image';

export function HeroTile() {
  return (
    <section
      id="hero"
      className="w-full max-w-4xl mb-8 rounded-xl shadow p-8 min-h-[400px] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/90 scroll-mt-24 scroll-snap-align"
    >
      <div className="flex flex-col items-center mb-6">
        <Image src="/globe.svg" alt="Slate360 Logo" width={64} height={64} />
        <h1 className="text-5xl font-orbitron font-bold text-slate360-blue mt-4 mb-2">Slate360</h1>
        <p className="text-lg text-slate360-slate font-inter mb-2">Your all-in-one construction platform</p>
      </div>
      <div className="w-full flex justify-center items-center min-h-[220px] bg-slate-100 dark:bg-slate-800 rounded-lg">
        {/* Placeholder for 3D Viewer */}
        <span className="text-xl text-slate360-blue font-semibold">3D Viewer (Coming Soon)</span>
      </div>
    </section>
  );
}

import React from 'react';

export function Tile({
  id,
  children,
  bg = 'white',
  align = 'left',
}: {
  id: string;
  children: React.ReactNode;
  bg?: 'white' | 'slate';
  align?: 'left' | 'right';
}) {
  const bgClass = bg === 'white' ? 'bg-white/90 dark:bg-slate-800/90' : 'bg-slate-100 dark:bg-slate-700/90';
  const flexClass = align === 'right' ? 'flex-row-reverse' : 'flex-row';
  return (
    <section
      id={id}
      className={`w-full max-w-4xl mb-8 rounded-xl shadow p-6 min-h-[300px] flex ${flexClass} items-center justify-between scroll-mt-24 ${bgClass} scroll-snap-align`}
    >
      {children}
    </section>
  );
}

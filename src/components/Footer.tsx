import React from 'react';

export function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto py-6 mt-16 text-xs text-slate-500 border-t bg-white/80 dark:bg-slate-900/80 flex flex-col items-center space-y-2">
      <div className="flex flex-wrap gap-4 justify-center">
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/cookies" className="hover:underline">Cookie Policy</a>
        <a href="/legal" className="hover:underline">Legal</a>
      </div>
      <div>&copy; {new Date().getFullYear()} Slate360. All rights reserved.</div>
    </footer>
  );
}

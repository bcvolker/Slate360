'use client';
import Link from 'next/link';
export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold">Slate360 Preview Login</h1>
        <p className="text-sm opacity-80">Click the button below to enter preview mode.</p>
        <a
          href="/api/preview/login"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2"
        >
          Continue to Dashboard
        </a>
        <p className="text-xs opacity-70">
          In preview, auth is bypassed. Replace with real auth when APIs are ready.
        </p>
        <p className="text-xs">
          Or <Link className="underline" href="/">go home</Link>.
        </p>
      </div>
    </main>
  );
}

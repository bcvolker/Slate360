import { Home, Layers3, Video, Camera, BarChart2 } from 'lucide-react';
import Link from 'next/link';

// This is our main App Shell component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50">
      {/* 1. Main Sidebar */}
      <aside className="w-20 flex flex-col items-center bg-white border-r border-zinc-200 py-4">
        <Link href="/">
          <img src="/slate360-logo.png" alt="Slate360" className="w-10 h-10" />
        </Link>
        <nav className="flex flex-col gap-4 mt-10">
          {/* These would be NavLink components that show an active state */}
          <Link href="/dashboard" title="Project Hub" className="p-3 rounded-lg bg-zinc-100 text-zinc-800">
            <Home className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/bim" title="BIM Studio" className="p-3 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <Layers3 className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/content" title="Content Creation" className="p-3 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <Video className="w-6 h-6" />
          </Link>
           <Link href="/dashboard/tours" title="360 Tours" className="p-3 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <Camera className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/reports" title="Reports" className="p-3 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <BarChart2 className="w-6 h-6" />
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 2. Top Header (User, Project Name, etc.) - Can be its own component */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Downtown Tower Renovation</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Search, Notifications, User Profile */}
          </div>
        </header>

        {/* 3. Main Content Area where child pages will be rendered */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

'use client';
import { Home, Layers3, Video, Camera, BarChart2, MapPin, Headphones, User, Crown, Search, Bell, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

// This is our main App Shell component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* 1. Main Sidebar */}
      <aside className="w-20 flex flex-col items-center bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 py-4">
        <Link href="/">
          <img src="/slate360-logo.png" alt="Slate360" className="w-10 h-10" />
        </Link>
        <nav className="flex flex-col gap-4 mt-10">
          {/* Navigation Items */}
          <Link href="/dashboard" title="Project Hub" className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
            <Home className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/bim" title="BIM Studio" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <Layers3 className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/content" title="Content Creation" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <Video className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/tours" title="360 Tours" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <Camera className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/geospatial" title="Geospatial" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/vr-ar" title="VR/AR" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <Headphones className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/reports" title="Reports" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <BarChart2 className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/account" title="Account" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <User className="w-6 h-6" />
          </Link>
          <Link href="/dashboard/ceo" title="CEO Dashboard" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            <Crown className="w-6 h-6" />
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 2. Top Header (User, Project Name, etc.) - Can be its own component */}
        <header className="h-16 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Downtown Tower Renovation</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search projects, files..." 
                className="pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              )}
            </button>
            
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
              <Bell className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </button>
            
            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
              <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </button>
            
            {/* User Profile */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
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

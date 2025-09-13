import NavBar from './components/NavBar';
import HomepageTiles from './components/HomepageTiles';

export default function HomePage() {
  return (
    <main className="min-h-svh bg-white text-[#2F4F4F]">
      <NavBar />
      <HomepageTiles />
      <footer className="snap-start py-12 border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-sm text-[#2F4F4F]/70">
          © {new Date().getFullYear()} Slate360. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

// src/components/DotNav.tsx
'use client';
// This is a simplified version. In the future, you can use an
// IntersectionObserver to dynamically highlight the dot for the active section.

const sections = [
  'Hero',
  'Project Hub',
  'BIM Studio',
  '360 Tour Builder',
  'Content Creation',
  'Geospatial & Robotics',
  'Reports & Analytics',
  'VR/AR Studio',
];

export default function DotNav() {
  // A real implementation would have state for the active section
  const activeSection = 'Hero'; 

  return (
    <nav className="fixed right-0 top-1/2 -translate-y-1/2 pr-8 z-50 hidden lg:block">
      <ul className="flex flex-col items-center gap-4">
        {sections.map((section) => (
          <li key={section} className="group relative">
            <a
              href={`#${section.toLowerCase().replace(/\s+/g, '-')}`} // Assumes you have sections with these IDs
              className={`block w-3 h-3 rounded-full transition-all duration-300
                ${activeSection === section ? 'bg-cyan-500 scale-125' : 'bg-zinc-600 group-hover:bg-zinc-400'}`}
            >
              <span className="sr-only">{section}</span>
            </a>
            {/* Tooltip that appears on hover */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1 bg-zinc-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {section}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// src/components/DotNav.tsx
'use client';

import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', name: 'Hero' },
  { id: 'project-hub', name: 'Project Hub' },
  { id: 'bim-studio', name: 'BIM Studio' },
  { id: '360-tour-builder', name: '360 Tour Builder' },
  { id: 'content-creation-studio', name: 'Content Creation' },
  { id: 'geospatial-robotics', name: 'Geospatial & Robotics' },
  { id: 'reports-analytics', name: 'Reports & Analytics' },
  { id: 'vr-ar-studio', name: 'VR/AR Studio' },
];

export default function DotNav() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Trigger when the section is in the middle of the viewport
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <nav className="fixed right-0 top-1/2 -translate-y-1/2 pr-8 z-50 hidden lg:block">
      <ul className="flex flex-col items-center gap-4">
        {sections.map((section) => (
          <li key={section.id} className="group relative">
            <a
              href={`#${section.id}`}
              className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-cyan-500 scale-125'
                  : 'bg-zinc-600 group-hover:bg-zinc-400'
              }`}
            >
              <span className="sr-only">{section.name}</span>
            </a>
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1 bg-zinc-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {section.name}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

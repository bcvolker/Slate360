'use client';
import React from 'react';

export const SideNav = ({ sections, activeSection }) => {
  return (
    <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end pr-4">
      <ul className="space-y-3">
        {sections.map(section => (
          <li key={section.id} className="side-nav-item group">
            <a href={`#${section.id}`} className="flex items-center gap-3">
              <span className="nav-tooltip">{section.title}</span>
              <div className={`nav-line ${activeSection === section.id ? 'active' : ''}`}></div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
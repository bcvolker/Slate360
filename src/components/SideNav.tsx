'use client';

import React from 'react';

export const SideNav = ({ sections, activeSection }: { 
  sections: any[], 
  activeSection: string 
}) => {
  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end space-y-3">
      {sections.map(section => (
        <a key={section.id} href={`#${section.id}`} className="side-nav-item group">
          <span className="nav-tooltip">{section.title}</span>
          <div className={`nav-line ${activeSection === section.id ? 'active' : ''}`}></div>
        </a>
      ))}
    </nav>
  );
};

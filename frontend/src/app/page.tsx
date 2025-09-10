'use client';
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import CleanHeader from '@/components/CleanHeader';

const TILES = [
  { 
    id: 'hero', 
    title: 'Slate360', 
    layout: 'hero' 
  },
  { 
    id: 'project-hub', 
    title: 'Project Hub', 
    subtitle: 'Plan, track, and coordinate.', 
    features: ['RFI & Submittal Tracking', 'Document Version Control'], 
    layout: 'left' 
  },
  { 
    id: 'bim-studio', 
    title: 'BIM Studio', 
    subtitle: '3D modeling & analysis.', 
    features: ['Real-time Clash Detection', 'Live Annotations & Markups'], 
    layout: 'right' 
  },
  { 
    id: 'content', 
    title: 'Content Creation', 
    subtitle: 'AI-powered media editing.', 
    features: ['Magnetic Video Timeline', 'AI Photo Enhancement'], 
    layout: 'left' 
  },
  { 
    id: 'tours', 
    title: '360 Tours', 
    subtitle: 'Immersive site walkthroughs.', 
    features: ['Interactive Hotspots', 'One-Click VR Export'], 
    layout: 'right' 
  },
];

export default function HomePage() {
  return (
    <>
      <CleanHeader />
      <main className="relative">
        {TILES.map((tile) => {
          if (tile.layout === 'hero') {
            return (
              <section key={tile.id} className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter text-foreground">
                    Build Smarter with Slate360
                  </h1>
                  <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
                    The complete construction technology platform that transforms how you manage projects, collaborate with teams, and deliver exceptional results.
                  </p>
                </div>
              </section>
            );
          }
          return (
            <section key={tile.id} className="min-h-screen flex items-center justify-center py-24 px-6">
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`p-2 ${tile.layout === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                  <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{tile.title}</h2>
                  <h3 className="mt-2 text-xl text-foreground/80">{tile.subtitle}</h3>
                  <ul className="mt-8 space-y-4">
                    {tile.features?.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-base font-medium text-foreground">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-2 ${tile.layout === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-border shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-primary rounded"></div>
                      </div>
                      <p className="text-foreground/60 font-medium">Interactive Demo</p>
                      <p className="text-sm text-foreground/40 mt-1">{tile.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
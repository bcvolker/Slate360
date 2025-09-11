'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ArrowRight, Code, Video, Bot, BarChart, HardHat, Orbit, Construction } from 'lucide-react';

// --- Data for our modular sections ---
const sections = [
  { id: 'home', title: 'Slate360', subtitle: 'The Future of Construction Technology', description: 'Our platform combines cutting-edge 3D visualization, advanced project management, and immersive technologies to revolutionize how you build.', Icon: Code },
  { id: 'project-hub', title: 'Project Hub', subtitle: 'Centralized Project Management', description: 'Track progress, manage teams, and collaborate in real-time with advanced project management tools designed for modern construction workflows.', Icon: HardHat },
  { id: 'bim-studio', title: 'BIM Studio', subtitle: 'Advanced 3D Modeling', description: 'Create, edit, and collaborate on Building Information Models with precision, parametric editing, and real-time updates.', Icon: Construction },
  { id: 'tours', title: '360 Tour Builder', subtitle: 'Immersive Site Walkthroughs', description: 'Create and share interactive 360° tours of your job sites, complete with annotations and hotspots for clear communication.', Icon: Orbit },
  { id: 'content-creation', title: 'Content Creation', subtitle: 'Professional Media Production', description: 'Leverage a magnetic timeline to edit videos, apply AI enhancements, and produce stunning marketing materials directly within the platform.', Icon: Video },
  { id: 'geospatial', title: 'Geospatial & Robotics', subtitle: 'Advanced Automation & Mapping', description: 'Plan drone missions, process survey data, and integrate with Google Street Maps for unparalleled site awareness.', Icon: Bot },
  { id: 'reports', title: 'Reports & Analytics', subtitle: 'Data-Driven Insights', description: 'Transform your construction data into actionable insights with real-time metrics, custom reports, and predictive analytics.', Icon: BarChart },
  { id: 'vr-studio', title: 'Virtual Reality Studio', subtitle: 'Immersive Design & Simulation', description: 'Step into your projects before they are built with immersive VR walkthroughs, design validation, and safety simulations.', Icon: Orbit }
];

// --- Reusable Footer Component ---
const Footer = () => (
  <footer className="w-full absolute bottom-0 left-0 p-6">
    <div className="container mx-auto max-w-6xl text-center border-t border-border/20 pt-4">
      <div className="space-x-6 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
        <Link href="/contact" className="hover:text-foreground">Contact</Link>
      </div>
      <p className="mt-2 text-xs text-muted-foreground/50">© 2025 Slate360. All rights reserved.</p>
    </div>
  </footer>
);

// --- Reusable Section Component for Modularity ---
const Section = ({ section, setActiveSection, isLast }: { 
  section: typeof sections[0], 
  setActiveSection: (id: string) => void, 
  isLast: boolean 
}) => {
  const { ref, inView } = useInView({ threshold: 0.6 });
  
  useEffect(() => {
    if (inView) {
      setActiveSection(section.id);
    }
  }, [inView, setActiveSection, section.id]);

  return (
    <section ref={ref} id={section.id} className="scroll-section">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl">{section.title}</h1>
            <h2 className="text-2xl lg:text-3xl text-primary font-semibold">{section.subtitle}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{section.description}</p>
            <div className="flex gap-4 pt-4">
              <Button size="lg">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SurfaceCard className="p-8 bg-card/50 backdrop-blur-md border-border/50 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-4">
                <section.Icon className="h-20 w-20 text-secondary" />
                <h3 className="text-2xl">{section.title}</h3>
                <p className="text-muted-foreground">{section.subtitle}</p>
              </div>
            </SurfaceCard>
          </motion.div>
        </div>
        {isLast && <Footer />}
      </div>
    </section>
  );
};


// --- Main Homepage Component ---
export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="bg-background fixed inset-0">
      <CleanHeader />

      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end space-y-2">
        {sections.map(section => (
          <a 
            key={section.id}
            href={`#${section.id}`}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${activeSection === section.id ? 'bg-primary text-primary-foreground scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {section.title}
          </a>
        ))}
      </nav>

      <div className="scroll-container">
        {sections.map((section, index) => (
          <Section 
            key={section.id} 
            section={section} 
            setActiveSection={setActiveSection}
            isLast={index === sections.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
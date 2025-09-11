'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ArrowRight, Code, Video, Bot, BarChart, HardHat, Orbit, Construction, UploadCloud } from 'lucide-react';

const sections = [
  { id: 'home', title: 'Slate360', subtitle: 'The Future of Construction Technology', longDescription: 'Our platform combines cutting-edge 3D visualization, advanced project management, and immersive technologies to revolutionize how you build, from planning to completion with unparalleled efficiency and collaboration.', Icon: Code, bgClass: 'bg-background' },
  { id: 'project-hub', title: 'Project Hub', subtitle: 'Centralized Project Management', longDescription: 'Track progress, manage teams, and collaborate in real-time with advanced project management tools. Share permissions and manage documents with an intuitive, Dropbox-like folder system for all stakeholders.', Icon: HardHat, bgClass: 'bg-slate-900/10' },
  { id: 'bim-studio', title: 'BIM Studio', subtitle: 'Advanced 3D Modeling', longDescription: 'Create, edit, and collaborate on Building Information Models with precision, parametric editing, and real-time updates. Animate fly-throughs, morph progression models, and prepare files for 3D printing.', Icon: Construction, bgClass: 'bg-background' },
  { id: 'tours', title: '360 Tour Builder', subtitle: 'Immersive Site Walkthroughs', longDescription: 'Create and share interactive 360° tours of your job sites, complete with annotations, hotspots, and notes for clear, visual communication with stakeholders from anywhere in the world.', Icon: Orbit, bgClass: 'bg-slate-900/10' },
  { id: 'content-creation', title: 'Content Creation', subtitle: 'Professional Media Production', longDescription: 'Leverage a magnetic timeline to edit videos, apply AI enhancements, and produce stunning marketing and progress materials with your custom branding applied effortlessly.', Icon: Video, bgClass: 'bg-background' },
  { id: 'geospatial', title: 'Geospatial & Robotics', subtitle: 'Advanced Automation & Mapping', longDescription: 'Plan drone missions, process survey data, and integrate with Google Street Maps for unparalleled site awareness and progress tracking. From mission to model, the workflow is seamless.', Icon: Bot, bgClass: 'bg-slate-900/10' },
  { id: 'reports', title: 'Reports & Analytics', subtitle: 'Data-Driven Insights', longDescription: 'Transform your construction data, including radiometric thermal imagery and site issues, into actionable insights with real-time metrics and customizable, brandable reports.', Icon: BarChart, bgClass: 'bg-background' },
  { id: 'vr-studio', title: 'Virtual Reality Studio', subtitle: 'Immersive Design & Simulation', longDescription: 'Step into your projects before they are built with immersive VR walkthroughs for design validation, stakeholder approvals, and collaborative safety simulations.', Icon: Orbit, bgClass: 'bg-slate-900/10' }
];

const Footer = () => (
  <footer className="w-full absolute bottom-0 left-0 p-8">
    <div className="container mx-auto max-w-screen-xl text-center border-t border-border/20 pt-6">
      <div className="space-x-6 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
        <Link href="/contact" className="hover:text-foreground">Contact</Link>
      </div>
      <p className="mt-4 text-xs text-muted-foreground/50">© 2025 Slate360. All rights reserved.</p>
    </div>
  </footer>
);

const Section = ({ section, setActiveSection, isLast, index }: { 
  section: typeof sections[0], 
  setActiveSection: (id: string) => void, 
  isLast: boolean,
  index: number
}) => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  
  useEffect(() => {
    if (inView) {
      setActiveSection(section.id);
    }
  }, [inView, setActiveSection, section.id]);

  const isOdd = index % 2 !== 0;

  return (
    <section ref={ref} id={section.id} className={`scroll-section ${section.bgClass}`}>
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className={`space-y-6 ${isOdd ? 'lg:order-last' : ''}`}
            initial={{ opacity: 0, x: isOdd ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl xl:text-6xl">{section.title}</h1>
            <h2 className="text-2xl xl:text-3xl text-primary font-semibold">{section.subtitle}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{section.longDescription}</p>
            <div className="flex gap-4 pt-4">
              <Button size="lg">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <SurfaceCard className="p-12 bg-card/30 backdrop-blur-lg border-2 border-dashed border-border/30 shadow-2xl min-h-[500px] flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-20 w-20 text-muted-foreground/50 mb-6" />
                <h3 className="text-2xl font-semibold text-foreground">Drag & Drop Your Files</h3>
                <p className="text-muted-foreground mt-2">Interactive Content Coming Soon</p>
            </SurfaceCard>
          </motion.div>
        </div>
        {isLast && <Footer />}
      </div>
    </section>
  );
};

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="bg-background fixed inset-0">
      <CleanHeader />
      <nav className="fixed right-8 top-1/4 -translate-y-1/2 z-50 hidden md:flex flex-col items-end space-y-1">
        {sections.map(section => (
          <a 
            key={section.id}
            href={`#${section.id}`}
            className={`text-xs font-semibold transition-all duration-200 ${activeSection === section.id ? 'text-secondary' : 'text-muted-foreground hover:text-foreground'}`}
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
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
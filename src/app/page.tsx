'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CleanHeader from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ArrowRight, Code, Video, Bot, BarChart, HardHat, Orbit, Construction, UploadCloud, Check } from 'lucide-react';

// Data for modular sections
const sections = [
  { id: 'home', title: 'Slate360', subtitle: 'The Future of Construction Technology', longDescription: 'Our platform combines cutting-edge 3D visualization, advanced project management, and immersive technologies to revolutionize how you build, from planning to completion with unparalleled efficiency and collaboration.', Icon: Code, bgClass: 'bg-background', features: ['Unified Platform', 'Real-Time Collaboration', 'Data-Driven Insights', 'Modular & Scalable'] },
  { id: 'project-hub', title: 'Project Hub', subtitle: 'Centralized Project Management', longDescription: 'Track progress, manage teams, and collaborate in real-time with advanced project management tools. Share permissions and manage documents with an intuitive, Dropbox-like folder system for all stakeholders.', Icon: HardHat, bgClass: 'bg-slate-900/10', features: ['RFI & Submittal Tracking', 'Document Control', 'Task Management', 'Daily Logs'] },
  { id: 'bim-studio', title: 'BIM Studio', subtitle: 'Advanced 3D Modeling', longDescription: 'Create, edit, and collaborate on Building Information Models with precision, parametric editing, and real-time updates. Animate fly-throughs, morph progression models, and prepare files for 3D printing.', Icon: Construction, bgClass: 'bg-background', features: ['Revit & SketchUp Integration', 'Clash Detection', 'Parametric Editing', '4D Sequencing'] },
  { id: 'tours', title: '360 Tour Builder', subtitle: 'Immersive Site Walkthroughs', longDescription: 'Create and share interactive 360° tours of your job sites, complete with annotations, hotspots, and notes for clear, visual communication with stakeholders from anywhere in the world.', Icon: Orbit, bgClass: 'bg-slate-900/10', features: ['Hotspot Annotations', 'VR Headset Compatible', 'Measurement Tools', 'Timeline Comparison'] },
  { id: 'content-creation', title: 'Content Creation', subtitle: 'Professional Media Production', longDescription: 'Leverage a magnetic timeline to edit videos, apply AI enhancements, and produce stunning marketing and progress materials with your custom branding applied effortlessly.', Icon: Video, bgClass: 'bg-background', features: ['AI Video Enhancement', 'Magnetic Timeline', 'LUTs & Effects', 'Branding Overlays'] },
  { id: 'geospatial', title: 'Geospatial & Robotics', subtitle: 'Advanced Automation & Mapping', longDescription: 'Plan drone missions, process survey data, and integrate with Google Street Maps for unparalleled site awareness and progress tracking. From mission to model, the workflow is seamless.', Icon: Bot, bgClass: 'bg-slate-900/10', features: ['Automated Mission Planning', 'Volumetric Analysis', 'Google Maps Overlay', 'Robotics Integration'] },
  { id: 'reports', title: 'Reports & Analytics', subtitle: 'Data-Driven Insights', longDescription: 'Transform your construction data, including radiometric thermal imagery and site issues, into actionable insights with real-time metrics and customizable, brandable reports.', Icon: BarChart, bgClass: 'bg-background', features: ['Custom Report Builder', 'Thermal Data Analysis', 'Predictive Analytics', 'KPI Dashboards'] },
  { id: 'vr-studio', title: 'Virtual Reality Studio', subtitle: 'Immersive Design & Simulation', longDescription: 'Step into your projects before they are built with immersive VR walkthroughs for design validation, stakeholder approvals, and collaborative safety simulations.', Icon: Orbit, bgClass: 'bg-slate-900/10', features: ['1:1 Scale Walkthroughs', 'Design Review Tools', 'Safety Simulation', 'Multi-User Sessions'] }
];

// Reusable Footer Component
const Footer = () => (
    <footer className="w-full absolute bottom-0 left-0 p-8">
        <div className="container mx-auto max-w-screen-xl text-center border-t border-border/20 pt-6">
            <div className="space-x-6 text-xs text-muted-foreground">
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground/50">© 2025 Slate360</p>
        </div>
    </footer>
);

// Reusable Section Component
const Section = ({ section, isLast, index }) => {
    const isOdd = index % 2 !== 0;
    return (
        <section id={section.id} className={`scroll-section ${section.bgClass}`}>
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <motion.div className={`space-y-6 ${isOdd ? 'lg:order-last' : 'lg:order-first'}`} initial={{ opacity: 0, x: isOdd ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-5xl font-bold font-orbitron">{section.title}</h1>
                        <h2 className="text-3xl text-slate360-copper">{section.subtitle}</h2>
                        <p className="text-lg">{section.longDescription}</p>
                        <ul className="list-inside space-y-2">
                            {section.features.map((f, i) => <li key={i} className="flex items-center gap-2"><Check className="h-5 w-5 text-primary"/><span>{f}</span></li>)}
                        </ul>
                    </motion.div>
                    <motion.div className="hidden lg:block" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                        <SurfaceCard className="p-12 bg-gradient-to-br from-card to-border/10 border-2 border-dashed border-slate360-blue/20 min-h-[600px] flex items-center justify-center">
                            <div className="text-center">
                                <UploadCloud className="h-24 w-24 text-slate360-blue/50 mb-4" />
                                <h3 className="text-2xl font-bold">Interactive Viewer</h3>
                                <p>Content Coming Soon</p>
                            </div>
                        </SurfaceCard>
                    </motion.div>
                </div>
                {isLast && <Footer />}
            </div>
        </section>
    );
};

// Reusable SideNav Component
const SideNav = ({ sections, activeSection }) => {
    return (
        <nav className="fixed right-4 top-1/4 -translate-y-1/2 z-50 hidden md:flex flex-col items-end space-y-1 text-xs">
            {sections.map(section => (
                <a key={section.id} href={`#${section.id}`} className={`transition-all ${activeSection === section.id ? 'text-slate360-copper font-medium' : 'text-foreground/70 hover:text-slate360-blue'}`}>
                    {section.title}
                </a>
            ))}
        </nav>
    );
};

export default function HomePage() {
    const [activeSection, setActiveSection] = useState('home');
    const { ref, inView } = useInView({ threshold: 0.5 });
    useEffect(() => {
        const currentSection = sections.find(s => inView && ref.current?.id === s.id);
        if (currentSection) {
            setActiveSection(currentSection.id);
        }
    }, [inView]);

    return (
        <div className="bg-background fixed inset-0">
            <CleanHeader />
            <SideNav sections={sections} activeSection={activeSection} />
            <div ref={ref} className="scroll-container">
                {sections.map((section, index) => (
                    <Section key={section.id} section={section} isLast={index === sections.length - 1} index={index} />
                ))}
            </div>
        </div>
    );
}
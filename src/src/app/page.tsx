'use client';

import React, { useState } from 'react';
import { CleanHeader } from '@/components/CleanHeader';
import { SideNav } from '@/components/SideNav';
import { HomePageSection } from '@/components/HomePageSection';
import { Code, Video, Bot, BarChart, HardHat, Orbit, Construction } from 'lucide-react';

const sections = [
  { id: 'home', title: 'Slate360', subtitle: 'The Future of Construction Technology', longDescription: 'Our platform combines cutting-edge 3D visualization, advanced project management, and immersive technologies to revolutionize how you build, from planning to completion with unparalleled efficiency and collaboration.', Icon: Code, bgClass: 'bg-background', features: ['Unified Platform', 'Real-Time Collaboration', 'Data-Driven Insights', 'Modular & Scalable'] },
  { id: 'project-hub', title: 'Project Hub', subtitle: 'Centralized Project Management', longDescription: 'Track progress, manage teams, and collaborate in real-time with advanced project management tools. Share permissions and manage documents with an intuitive, Dropbox-like folder system for all stakeholders.', Icon: HardHat, bgClass: 'bg-card', features: ['RFI & Submittal Tracking', 'Document Control', 'Task Management', 'Daily Logs'] },
  { id: 'bim-studio', title: 'BIM Studio', subtitle: 'Advanced 3D Modeling', longDescription: 'Create, edit, and collaborate on Building Information Models with precision, parametric editing, and real-time updates. Animate fly-throughs, morph progression models, and prepare files for 3D printing.', Icon: Construction, bgClass: 'bg-background', features: ['Revit & SketchUp Integration', 'Clash Detection', 'Parametric Editing', '4D Sequencing'] },
  { id: 'tours', title: '360 Tour Builder', subtitle: 'Immersive Site Walkthroughs', longDescription: 'Create and share interactive 360° tours of your job sites, complete with annotations, hotspots, and notes for clear, visual communication with stakeholders from anywhere in the world.', Icon: Orbit, bgClass: 'bg-card', features: ['Hotspot Annotations', 'VR Headset Compatible', 'Measurement Tools', 'Timeline Comparison'] },
  { id: 'content-creation', title: 'Content Creation', subtitle: 'Professional Media Production', longDescription: 'Leverage a magnetic timeline to edit videos, apply AI enhancements, and produce stunning marketing and progress materials with your custom branding applied effortlessly.', Icon: Video, bgClass: 'bg-background', features: ['AI Video Enhancement', 'Magnetic Timeline', 'LUTs & Effects', 'Branding Overlays'] },
  { id: 'geospatial', title: 'Geospatial & Robotics', subtitle: 'Advanced Automation & Mapping', longDescription: 'Plan drone missions, process survey data, and integrate with Google Street Maps for unparalleled site awareness and progress tracking. From mission to model, the workflow is seamless.', Icon: Bot, bgClass: 'bg-card', features: ['Automated Mission Planning', 'Volumetric Analysis', 'Google Maps Overlay', 'Robotics Integration'] },
  { id: 'reports', title: 'Reports & Analytics', subtitle: 'Data-Driven Insights', longDescription: 'Transform your construction data, including radiometric thermal imagery and site issues, into actionable insights with real-time metrics and customizable, brandable reports.', Icon: BarChart, bgClass: 'bg-background', features: ['Custom Report Builder', 'Thermal Data Analysis', 'Predictive Analytics', 'KPI Dashboards'] },
  { id: 'vr-studio', title: 'Virtual Reality Studio', subtitle: 'Immersive Design & Simulation', longDescription: 'Step into your projects before they are built with immersive VR walkthroughs for design validation, stakeholder approvals, and collaborative safety simulations.', Icon: Orbit, bgClass: 'bg-card', features: ['1:1 Scale Walkthroughs', 'Design Review Tools', 'Safety Simulation', 'Multi-User Sessions'] }
];

export default function HomePage() {
    const [activeSection, setActiveSection] = useState('home');

    return (
        <>
            <CleanHeader />
            <SideNav sections={sections} activeSection={activeSection} />

            <main className="scroll-container">
                {sections.map((section, index) => (
                    <HomePageSection 
                        key={section.id} 
                        section={section} 
                        setActiveSection={setActiveSection}
                        isLast={index === sections.length - 1}
                        index={index}
                    />
                ))}
            </main>
        </>
    );
}
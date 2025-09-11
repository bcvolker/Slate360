'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Check, UploadCloud } from 'lucide-react';

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

export const HomePageSection = ({ section, setActiveSection, isLast, index }: { 
  section: any, 
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <motion.div 
                        className={`space-y-4 ${isOdd ? 'lg:order-last' : ''}`}
                        initial={{ opacity: 0, x: isOdd ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className="text-4xl md:text-5xl">{section.title}</h1>
                        <h2 className="text-2xl md:text-3xl text-primary font-semibold">{section.subtitle}</h2>
                        <p className="text-md md:text-lg text-muted-foreground leading-relaxed">{section.longDescription}</p>
                        <ul className="space-y-2 pt-4">
                            {section.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-secondary" />
                                    <span className="text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    
                    {/* VIEWER: Hidden on mobile, visible on large screens */}
                    <motion.div
                        className="hidden lg:flex"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <SurfaceCard className="p-12 w-full bg-card/30 backdrop-blur-lg border-2 border-dashed border-border/30 shadow-2xl min-h-[450px] flex flex-col items-center justify-center text-center">
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

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// NOTE: The dynamic imports for the viewers have been removed to fix the build error.

const TILES = [
    { id: 'slate360', title: 'Slate360', viewerType: '3d-model' },
    { id: 'project-hub', title: 'Project Hub', viewerType: 'image' },
    { id: 'bim-studio', title: 'BIM Studio', viewerType: '3d-model' },
    { id: '360-tour-builder', title: '360 Tour Builder', viewerType: '360-tour' },
    { id: 'content-studio', title: 'Content Studio', viewerType: 'video' },
    { id: 'geospatial', title: 'Geospatial & Robotics', viewerType: 'map' },
    { id: 'reports', title: 'Reports & Analytics', viewerType: 'image' },
    { id: 'vr-ar', title: 'VR/AR Studio', viewerType: '3d-model' }
];

const Homepage = () => {
    const [activeTileIndex, setActiveTileIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToTile = (index: number) => {
        const tileElement = document.getElementById(TILES[index].id);
        if (tileElement) {
            tileElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToNext = () => {
        if (activeTileIndex < TILES.length - 1) {
            scrollToTile(activeTileIndex + 1);
        }
    };

    const handleScrollToPrev = () => {
        if (activeTileIndex > 0) {
            scrollToTile(activeTileIndex - 1);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = TILES.findIndex(tile => tile.id === entry.target.id);
                        if (index !== -1) {
                            setActiveTileIndex(index);
                        }
                    }
                });
            },
            { threshold: 0.7 }
        );

        TILES.forEach(tile => {
            const el = document.getElementById(tile.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);


    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            
            {/* Horizontal Line Navigation */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center">
                <AnimatePresence>
                    {activeTileIndex > 0 && (
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleScrollToPrev} className="mb-4">
                            <ChevronUp size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
                <div className="relative flex flex-col items-center">
                    <div className="absolute top-0 left-1/2 w-px bg-gray-600" style={{ height: '100%' }}></div>
                    {TILES.map((tile, index) => (
                        <a key={tile.id} href={`#${tile.id}`}
                           className="relative my-2 w-full flex items-center"
                           onClick={(e) => { e.preventDefault(); scrollToTile(index); }}>
                            <span className={`absolute right-6 w-2.5 h-0.5 transition-all duration-300 ${activeTileIndex === index ? 'bg-white w-8' : 'bg-gray-600'}`}></span>
                            <span className={`ml-12 text-sm transition-colors duration-300 ${activeTileIndex === index ? 'text-white' : 'text-gray-600'}`}>{tile.title}</span>
                        </a>
                    ))}
                </div>
                 <AnimatePresence>
                    {activeTileIndex < TILES.length - 1 && (
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleScrollToNext} className="mt-4">
                            <ChevronDown size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Scroll Container */}
            <div ref={containerRef} className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
                {TILES.map((tile) => (
                    <section key={tile.id} id={tile.id} className="h-screen w-screen snap-start flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold">{tile.title}</h1>
                            <p className="mt-4 text-gray-400">Content Coming Soon</p>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
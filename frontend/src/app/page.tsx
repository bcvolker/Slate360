'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TILES = [
    { 
        id: 'slate360', 
        title: 'SLATE360', 
        subtitle: 'The Future of Construction Technology',
        description: 'SLATE360 creates safe, efficient, and intelligent construction workflows with advanced 3D modeling, real-time collaboration, and immersive technologies.',
        icon: '🚀',
        color: 'blue'
    },
    { 
        id: 'project-hub', 
        title: 'PROJECT HUB', 
        subtitle: 'Centralized Project Management',
        description: 'Manage all your construction projects from one powerful dashboard with real-time collaboration and advanced tracking.',
        icon: '📊',
        color: 'green'
    },
    { 
        id: 'bim-studio', 
        title: 'BIM STUDIO', 
        subtitle: 'Advanced 3D Modeling',
        description: 'Create, edit, and collaborate on Building Information Models with precision and real-time updates.',
        icon: '🏗️',
        color: 'purple'
    },
    { 
        id: '360-tour-builder', 
        title: '360 TOUR BUILDER', 
        subtitle: 'Immersive Virtual Tours',
        description: 'Create stunning 360-degree virtual tours and interactive walkthroughs of your construction projects.',
        icon: '🌐',
        color: 'cyan'
    },
    { 
        id: 'content-studio', 
        title: 'CONTENT STUDIO', 
        subtitle: 'Professional Media Production',
        description: 'Create high-quality images, videos, and interactive content for your construction projects.',
        icon: '🎬',
        color: 'orange'
    },
    { 
        id: 'geospatial', 
        title: 'GEOSPATIAL & ROBOTICS', 
        subtitle: 'Advanced Automation & Mapping',
        description: 'Leverage drone technology, GPS mapping, and robotic automation for precise construction operations.',
        icon: '🤖',
        color: 'pink'
    },
    { 
        id: 'reports', 
        title: 'REPORTS & ANALYTICS', 
        subtitle: 'Data-Driven Insights',
        description: 'Advanced analytics and reporting tools for informed decision-making and project optimization.',
        icon: '📈',
        color: 'blue'
    },
    { 
        id: 'vr-ar', 
        title: 'VR/AR STUDIO', 
        subtitle: 'Immersive Technologies',
        description: 'Experience your projects in virtual and augmented reality for enhanced visualization and collaboration.',
        icon: '🥽',
        color: 'purple'
    }
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

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'from-blue-500/10 to-blue-600/10 border-blue-500/20';
            case 'green': return 'from-green-500/10 to-green-600/10 border-green-500/20';
            case 'purple': return 'from-purple-500/10 to-purple-600/10 border-purple-500/20';
            case 'cyan': return 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/20';
            case 'orange': return 'from-orange-500/10 to-orange-600/10 border-orange-500/20';
            case 'pink': return 'from-pink-500/10 to-pink-600/10 border-pink-500/20';
            default: return 'from-gray-500/10 to-gray-600/10 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            
            {/* Horizontal Line Navigation */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center">
                <AnimatePresence>
                    {activeTileIndex > 0 && (
                        <motion.button 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={handleScrollToPrev} 
                            className="mb-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronUp size={20} />
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
                            <span className={`ml-12 text-xs transition-colors duration-300 ${activeTileIndex === index ? 'text-white' : 'text-gray-600'}`}>{tile.title}</span>
                        </a>
                    ))}
                </div>
                <AnimatePresence>
                    {activeTileIndex < TILES.length - 1 && (
                        <motion.button 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={handleScrollToNext} 
                            className="mt-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronDown size={20} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Scroll Container */}
            <div ref={containerRef} className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
                {TILES.map((tile, index) => (
                    <section key={tile.id} id={tile.id} className="h-screen w-screen snap-start flex items-center justify-center relative">
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(tile.color)} opacity-30`}></div>
                        
                        {/* Content */}
                        <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left Content */}
                            <div className="text-left">
                                <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                                    {tile.title}
                                </h1>
                                <h2 className="text-xl lg:text-2xl font-normal mb-6 text-gray-300">
                                    {tile.subtitle}
                                </h2>
                                <p className="text-base lg:text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl">
                                    {tile.description}
                                </p>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors">
                                        GET STARTED →
                                    </button>
                                    <button className="px-6 py-3 border border-white text-white font-medium rounded hover:bg-white hover:text-black transition-colors">
                                        LEARN MORE
                                    </button>
                                </div>
                            </div>
                            
                            {/* Right Tile */}
                            <div className="flex justify-center lg:justify-end">
                                <div className={`w-64 h-64 bg-gradient-to-br ${getColorClasses(tile.color)} border rounded-xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm`}>
                                    <div className="text-4xl mb-4">{tile.icon}</div>
                                    <h3 className="text-lg font-semibold mb-2">{tile.title}</h3>
                                    <p className="text-sm text-gray-300 mb-4">{tile.subtitle}</p>
                                    <div className="w-12 h-0.5 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
                
                {/* Footer */}
                <footer className="h-screen w-screen snap-start flex flex-col justify-center items-center bg-gray-900 relative">
                    <div className="max-w-6xl mx-auto px-8 text-center">
                        <h2 className="text-4xl font-bold mb-6">SLATE360</h2>
                        <p className="text-lg text-gray-400 mb-12 max-w-3xl">
                            The future of construction technology. Transform how you build with advanced 3D modeling, real-time collaboration, and immersive technologies.
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div>
                                <h3 className="font-semibold mb-4">Product</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Company</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Support</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Legal</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 pt-8">
                            <p className="text-sm text-gray-500">
                                © 2025 SLATE360. All rights reserved. | Built with innovation for the construction industry.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Homepage;
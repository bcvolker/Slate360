'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TILES = [
    { 
        id: 'slate360', 
        title: 'SLATE360', 
        subtitle: 'The Future of Construction Technology',
        description: 'SLATE360 creates safe, efficient, and intelligent construction workflows with advanced 3D modeling, real-time collaboration, and immersive technologies. Our platform revolutionizes how construction teams plan, execute, and deliver projects with unprecedented precision and efficiency.',
        features: ['Real-time Collaboration', 'Advanced 3D Modeling', 'Immersive Technologies', 'Smart Analytics'],
        icon: '🚀',
        color: 'blue',
        layout: 'hero',
        viewerType: 'hero'
    },
    { 
        id: 'project-hub', 
        title: 'Project Hub', 
        subtitle: 'Plan, track, and coordinate every stakeholder.',
        description: 'Centralize RFIs, submittals, and progress reports. Keep your entire team aligned and your project on schedule, from groundbreaking to handover.',
        features: ['RFI Management', 'Submittal Tracking', 'Progress Reports', 'Team Coordination'],
        icon: '📊',
        color: 'green',
        layout: 'left',
        viewerType: 'image',
        viewerUrl: 'https://images.unsplash.com/photo-1529429617124-95b109e86f1c'
    },
    { 
        id: 'bim-studio', 
        title: 'BIM Studio', 
        subtitle: 'Import IFC/GLTF, annotate models, and collaborate.',
        description: 'Experience a high-performance BIM viewer right in your browser. Conduct clash detection, add annotations, and share model states in real-time.',
        features: ['IFC/GLTF Support', 'Clash Detection', 'Real-time Annotations', 'Model Sharing'],
        icon: '🏗️',
        color: 'purple',
        layout: 'right',
        viewerType: 'model',
        viewerUrl: '/mock/tower.ifc'
    },
    { 
        id: '360-tour-builder', 
        title: '360 Tour Builder', 
        subtitle: 'Create immersive virtual walkthroughs.',
        description: 'Build stunning 360-degree virtual tours and interactive walkthroughs of your construction projects. Showcase your work to clients and stakeholders with immersive experiences.',
        features: ['360° Photography', 'Virtual Walkthroughs', 'Interactive Tours', 'Client Presentations'],
        icon: '🌐',
        color: 'cyan',
        layout: 'left',
        viewerType: 'tour',
        viewerUrl: '/mock/tour.html'
    },
    { 
        id: 'content-studio', 
        title: 'Content Creation Studio', 
        subtitle: 'Professional media production from site data.',
        description: 'Create high-quality images, videos, and interactive content for your construction projects. Our content studio provides all the tools you need to document, showcase, and market your construction work professionally.',
        features: ['Video Production', 'Image Editing', 'Content Management', 'Marketing Tools'],
        icon: '🎬',
        color: 'orange',
        layout: 'right',
        viewerType: 'video',
        viewerUrl: '/mock/demo.mp4'
    },
    { 
        id: 'geospatial', 
        title: 'Geospatial & Robotics', 
        subtitle: 'Advanced automation and mapping.',
        description: 'Leverage drone technology, GPS mapping, and robotic automation for precise construction operations. Our geospatial tools provide accurate site mapping, progress monitoring, and automated data collection.',
        features: ['Drone Mapping', 'GPS Integration', 'Robotic Automation', 'Site Analysis'],
        icon: '🤖',
        color: 'pink',
        layout: 'left',
        viewerType: 'model',
        viewerUrl: '/mock/drone-mapping.glb'
    },
    { 
        id: 'reports', 
        title: 'Reports & Analytics', 
        subtitle: 'Data-driven insights for better decisions.',
        description: 'Advanced analytics and reporting tools for informed decision-making and project optimization. Transform raw construction data into actionable insights that drive efficiency and improve project outcomes.',
        features: ['Performance Analytics', 'Custom Reports', 'Data Visualization', 'Predictive Insights'],
        icon: '📈',
        color: 'blue',
        layout: 'right',
        viewerType: 'model',
        viewerUrl: '/mock/analytics-dashboard.glb'
    },
    { 
        id: 'vr-ar', 
        title: 'VR/AR Studio', 
        subtitle: 'Immersive technologies for visualization.',
        description: 'Experience your projects in virtual and augmented reality for enhanced visualization and collaboration. Our VR/AR tools enable immersive project walkthroughs, design reviews, and client presentations.',
        features: ['Virtual Reality', 'Augmented Reality', 'Immersive Walkthroughs', 'Design Reviews'],
        icon: '🥽',
        color: 'purple',
        layout: 'left',
        viewerType: 'model',
        viewerUrl: '/mock/complex.ifc'
    }
];

// Unified Viewer Component
const UnifiedViewer = ({ tile }: { tile: any }) => {
    const getFileExtension = (url: string) => {
        return url.split('.').pop()?.toLowerCase() || '';
    };

    const getViewerContent = () => {
        const extension = getFileExtension(tile.viewerUrl || '');
        
        // Handle different file types
        if (tile.viewerType === 'hero') {
            return (
                <div className="text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <h3 className="text-xl font-bold mb-1">SLATE360</h3>
                    <p className="text-sm text-gray-300">The Future of Construction</p>
                </div>
            );
        }
        
        if (tile.viewerType === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return (
                <img 
                    src={tile.viewerUrl} 
                    alt="Content" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                />
            );
        }
        
        if (tile.viewerType === 'video' || ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
            return (
                <video 
                    src={tile.viewerUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to placeholder if video fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                />
            );
        }
        
        if (tile.viewerType === 'model' || ['glb', 'gltf', 'obj', 'fbx', 'dae', 'ifc'].includes(extension)) {
            return (
                <div className="text-center">
                    <div className="text-4xl mb-2">🏗️</div>
                    <p className="text-sm text-gray-400">3D Model Viewer</p>
                    <p className="text-xs text-gray-500 mt-1">{extension.toUpperCase()}</p>
                </div>
            );
        }
        
        if (tile.viewerType === 'tour' || ['html', 'htm'].includes(extension)) {
            return (
                <div className="text-center">
                    <div className="text-4xl mb-2">🌐</div>
                    <p className="text-sm text-gray-400">360° Tour</p>
                    <p className="text-xs text-gray-500 mt-1">Interactive</p>
                </div>
            );
        }
        
        // Default fallback for unknown types
        return (
            <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm text-gray-400">File Viewer</p>
                <p className="text-xs text-gray-500 mt-1">{extension.toUpperCase() || 'Unknown'}</p>
            </div>
        );
    };

    return (
        <div className="w-full h-full relative flex items-center justify-center">
            {getViewerContent()}
            
            {/* Fallback placeholder - hidden by default */}
            <div className="hidden absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-sm text-gray-400">Content Preview</p>
                    <p className="text-xs text-gray-500 mt-1">Loading...</p>
                </div>
            </div>
        </div>
    );
};

const Homepage = () => {
    const [activeTileIndex, setActiveTileIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToTile = (index: number) => {
        if (isScrolling) return; // Prevent multiple scrolls
        
        setIsScrolling(true);
        const tileElement = document.getElementById(TILES[index].id);
        if (tileElement) {
            tileElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Reset scrolling state after smooth animation
        setTimeout(() => setIsScrolling(false), 800);
    };

    const handleScrollToNext = () => {
        if (activeTileIndex < TILES.length - 1 && !isScrolling) {
            scrollToTile(activeTileIndex + 1);
        }
    };

    const handleScrollToPrev = () => {
        if (activeTileIndex > 0 && !isScrolling) {
            scrollToTile(activeTileIndex - 1);
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isScrolling) return;
            
            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    handleScrollToNext();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    handleScrollToPrev();
                    break;
                case 'Home':
                    e.preventDefault();
                    scrollToTile(0);
                    break;
                case 'End':
                    e.preventDefault();
                    scrollToTile(TILES.length - 1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTileIndex, isScrolling]);

    // Handle wheel/touch scrolling with debouncing
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let scrollTimeout: NodeJS.Timeout;
        let isScrollingWheel = false;

        const handleWheel = (e: WheelEvent) => {
            if (isScrollingWheel) return;
            
            isScrollingWheel = true;
            clearTimeout(scrollTimeout);
            
            const delta = e.deltaY;
            const threshold = 50; // Minimum scroll distance
            
            if (Math.abs(delta) > threshold) {
                if (delta > 0 && activeTileIndex < TILES.length - 1) {
                    // Scroll down
                    scrollToTile(activeTileIndex + 1);
                } else if (delta < 0 && activeTileIndex > 0) {
                    // Scroll up
                    scrollToTile(activeTileIndex - 1);
                }
            }
            
            scrollTimeout = setTimeout(() => {
                isScrollingWheel = false;
            }, 500);
        };

        const handleTouchStart = (e: TouchEvent) => {
            const startY = e.touches[0].clientY;
            let startTime = Date.now();
            
            const handleTouchEnd = (e: TouchEvent) => {
                const endY = e.changedTouches[0].clientY;
                const endTime = Date.now();
                const deltaY = startY - endY;
                const deltaTime = endTime - startTime;
                
                // Only trigger if it's a quick swipe (not a slow scroll)
                if (deltaTime < 300 && Math.abs(deltaY) > 50) {
                    if (deltaY > 0 && activeTileIndex < TILES.length - 1) {
                        // Swipe up - go to next tile
                        scrollToTile(activeTileIndex + 1);
                    } else if (deltaY < 0 && activeTileIndex > 0) {
                        // Swipe down - go to previous tile
                        scrollToTile(activeTileIndex - 1);
                    }
                }
                
                document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchend', handleTouchEnd);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchstart', handleTouchStart, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            clearTimeout(scrollTimeout);
        };
    }, [activeTileIndex, isScrolling]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isScrolling) {
                        const index = TILES.findIndex(tile => tile.id === entry.target.id);
                        if (index !== -1) {
                            setActiveTileIndex(index);
                        }
                    }
                });
            },
            { 
                threshold: 0.6,
                rootMargin: '0px'
            }
        );

        TILES.forEach(tile => {
            const el = document.getElementById(tile.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isScrolling]);

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
        <div className="min-h-screen overflow-hidden relative bg-gradient-to-b from-zinc-900 to-zinc-950">
            

            {/* Scroll Container */}
            <div 
                ref={containerRef} 
                className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory"
                style={{
                    scrollBehavior: 'smooth',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'y mandatory',
                    scrollPaddingTop: '0px'
                }}
            >
                {TILES.map((tile, index) => (
                    <section key={tile.id} id={tile.id} className="tile-item relative min-h-[100dvh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
                        {tile.layout === 'hero' && (
                            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-12">
                                <div className="absolute inset-0 -z-10 bg-noise" />
                                <div className="p-4">
                                    <div className="surface overflow-hidden shadow-2xl">
                                        <div className="w-full h-96">
                                            <UnifiedViewer tile={tile} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 text-center lg:text-left">
                                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-zinc-50">
                                        Build Smarter with Slate360
                                    </h1>
                                    <p className="mt-4 text-lg text-zinc-400 max-w-prose mx-auto lg:mx-0">
                                        Photogrammetry, LiDAR, GNSS, and BIM in one modern workspace. Upload data, process in the cloud, and deliver interactive models.
                                    </p>
                                    <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                                        <a href="/dashboard" className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium text-white transition-colors" style={{ backgroundColor: 'var(--brand-accent)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-accent)'}>Open Dashboard</a>
                                        <a href="/bim" className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium ring-1 ring-zinc-700 text-zinc-200 hover:bg-zinc-800 transition-colors">Try BIM Studio</a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tile.layout !== 'hero' && (
                            <div className={`w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                                {/* Copy Column */}
                                <div className={`p-2 ${tile.layout === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-50">{tile.title}</h2>
                                    <h3 className="mt-2 text-xl text-zinc-300">{tile.subtitle}</h3>
                                    <p className="mt-4 text-base text-zinc-400">{tile.description}</p>
                                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {tile.features?.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-zinc-200">
                                                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--brand-accent)' }} />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Media Column */}
                                <div className={`p-2 ${tile.layout === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <div className="surface overflow-hidden shadow-xl">
                                        <div className="w-full h-96">
                                            <UnifiedViewer tile={tile} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Footer - Only on last tile */}
                        {index === TILES.length - 1 && (
                            <footer className="absolute bottom-0 left-0 right-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800">
                                <div className="max-w-6xl mx-auto px-8 py-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Product</h3>
                                            <ul className="space-y-1 text-xs text-zinc-400">
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Features</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Pricing</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Demo</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">API</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Company</h3>
                                            <ul className="space-y-1 text-xs text-zinc-400">
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">About</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Careers</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Press</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Blog</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Support</h3>
                                            <ul className="space-y-1 text-xs text-zinc-400">
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Help Center</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Contact</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Status</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Community</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-zinc-50">Legal</h3>
                                            <ul className="space-y-1 text-xs text-zinc-400">
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Privacy Policy</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Terms of Service</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Cookie Policy</a></li>
                                                <li><a href="#" className="hover:text-zinc-100 transition-colors">Security</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-zinc-800 pt-3 text-center">
                                        <p className="text-xs text-zinc-500">
                                            © 2025 SLATE360. All rights reserved. | Built with innovation for the construction industry.
                                        </p>
                                    </div>
                                </div>
                            </footer>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
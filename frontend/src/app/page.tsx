'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { UnifiedViewer } from '@/components/viewers/UnifiedViewer';
import { VideoViewer } from '@/components/viewers/VideoViewer';
import { TourViewer } from '@/components/viewers/TourViewer';

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
        icon: '  ',
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

// Mock data for tour steps
const mockTourSteps = [
    {
        id: 'step1',
        title: 'Project Overview',
        description: 'Get a comprehensive view of the construction project',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5'
    },
    {
        id: 'step2',
        title: 'Site Analysis',
        description: 'Detailed analysis of the construction site',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12'
    },
    {
        id: 'step3',
        title: 'Progress Tracking',
        description: 'Monitor construction progress in real-time',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'
    }
];

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
        <div className="min-h-screen overflow-hidden relative">
            

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
                {TILES.map((tile, index) => {
                    // Map tile IDs to the correct section IDs for DotNav
                    const sectionIdMap: { [key: string]: string } = {
                        'slate360': 'hero',
                        'project-hub': 'project-hub',
                        'bim-studio': 'bim-studio',
                        '360-tour-builder': '360-tour-builder',
                        'content-studio': 'content-creation-studio',
                        'geospatial': 'geospatial-robotics',
                        'reports': 'reports-analytics',
                        'vr-ar': 'vr-ar-studio'
                    };
                    
                    return (
                    <section key={tile.id} id={sectionIdMap[tile.id] || tile.id} className="tile-item relative min-h-[100dvh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
                        {tile.layout === 'hero' && (
                            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-12">
                                <div className="absolute inset-0 -z-10 bg-noise" />
                                <div className="p-4">
                                    <SurfaceCard className="overflow-hidden shadow-2xl">
                                        <div className="w-full h-96">
                                            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                                                <UnifiedViewer 
                                                    title={tile.title}
                                                    type="model"
                                                    src={tile.viewerUrl || '/mock/hero-model.glb'}
                                                />
                                            </Suspense>
                                        </div>
                                    </SurfaceCard>
                                </div>
                                <div className="p-4 text-center lg:text-left">
                                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-foreground">
                                        Build Smarter with Slate360
                                    </h1>
                                    <p className="mt-4 text-lg text-muted-foreground max-w-prose mx-auto lg:mx-0">
                                        Photogrammetry, LiDAR, GNSS, and BIM in one modern workspace. Upload data, process in the cloud, and deliver interactive models.
                                    </p>
                                    <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                                        <a href="/dashboard" className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Open Dashboard</a>
                                        <a href="/bim" className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium ring-1 ring-border text-foreground hover:bg-accent transition-colors">Try BIM Studio</a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tile.layout !== 'hero' && (
                            <div className={`w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                                {/* Copy Column */}
                                <div className={`p-2 ${tile.layout === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{tile.title}</h2>
                                    <h3 className="mt-2 text-xl text-muted-foreground">{tile.subtitle}</h3>
                                    <p className="mt-4 text-base text-muted-foreground">{tile.description}</p>
                                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {tile.features?.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                                                <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Media Column */}
                                <div className={`p-2 ${tile.layout === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <SurfaceCard className="overflow-hidden shadow-xl">
                                        <div className="w-full h-96">
                                            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                                                {tile.viewerType === 'video' ? (
                                                    <VideoViewer 
                                                        title={tile.title}
                                                        src={tile.viewerUrl || '/mock/demo.mp4'}
                                                    />
                                                ) : tile.viewerType === 'tour' ? (
                                                    <TourViewer 
                                                        title={tile.title}
                                                        steps={mockTourSteps}
                                                    />
                                                ) : (
                                                    <UnifiedViewer 
                                                        title={tile.title}
                                                        type={tile.viewerType as 'image' | 'model' | 'document'}
                                                        src={tile.viewerUrl || '/mock/placeholder.jpg'}
                                                    />
                                                )}
                                            </Suspense>
                                        </div>
                                    </SurfaceCard>
                                </div>
                            </div>
                        )}
                        
                        {/* Footer - Only on last tile */}
                        {index === TILES.length - 1 && (
                            <footer className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t border-border">
                                <div className="max-w-6xl mx-auto px-8 py-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-foreground">Product</h3>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Demo</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-foreground">Company</h3>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-foreground">Support</h3>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-sm text-foreground">Legal</h3>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                                                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-border pt-3 text-center">
                                        <p className="text-xs text-muted-foreground">
                                            © 2025 SLATE360. All rights reserved. | Built with innovation for the construction industry.
                                        </p>
                                    </div>
                                </div>
                            </footer>
                        )}
                    </section>
                    );
                })}
            </div>
        </div>
    );
};

export default Homepage;
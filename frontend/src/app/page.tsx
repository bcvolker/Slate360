'use client';
// Updated homepage with improved layout and content - v2
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Homepage() {
  const [currentTile, setCurrentTile] = useState(0);
  const tilesRef = useRef<HTMLDivElement>(null);

  const tiles = [
    {
      id: 'slate360',
      title: 'SLATE360',
      subtitle: 'The Future of Construction Technology',
      description: 'SLATE360 creates safe, efficient, and intelligent construction workflows with advanced 3D modeling, real-time collaboration, and immersive technologies.',
      mission: 'The mission: solve construction complexity, enable rapid project delivery, and transform how we build.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-5xl mb-3 font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🏗️
            </div>
            <p className="text-lg font-bold mb-1">SLATE360 PLATFORM</p>
            <p className="text-sm text-gray-300">Construction Technology Revolution</p>
            <div className="mt-3 flex justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white leading-tight">
              SLATE360 creates safe, efficient, and intelligent construction workflows
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Our platform combines cutting-edge 3D visualization, advanced project management, 
              and immersive technologies to revolutionize how you build.
            </p>
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-3 rounded-lg border border-blue-500/30">
              <p className="text-sm font-semibold text-blue-300">
                The mission: solve construction complexity, enable rapid project delivery, and transform how we build.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center group">
              GET STARTED
              <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white hover:text-black transition-colors">
              VIEW DEMO
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'project-hub',
      title: 'PROJECT HUB',
      subtitle: 'Centralized Project Management',
      description: 'Manage all your construction projects from one powerful dashboard with real-time collaboration and advanced tracking.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-8xl mb-6 font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              📊
            </div>
            <p className="text-2xl font-bold mb-2">PROJECT DASHBOARD</p>
            <p className="text-lg text-gray-300">Real-time Management Interface</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              Centralize all your construction projects in one powerful dashboard
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Track progress, manage teams, and collaborate in real-time with advanced project management tools 
              designed for modern construction workflows.
            </p>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg border border-green-500/30">
              <p className="text-base font-semibold text-green-300">
                Real-time collaboration and advanced tracking for maximum efficiency.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group">
              EXPLORE PROJECTS
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white hover:text-black transition-colors">
              VIEW ANALYTICS
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'bim-studio',
      title: 'BIM STUDIO',
      subtitle: 'Advanced 3D Modeling',
      description: 'Create, edit, and collaborate on Building Information Models with precision and real-time updates.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-8xl mb-6 font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎥
            </div>
            <p className="text-2xl font-bold mb-2">BIM STUDIO</p>
            <p className="text-lg text-gray-300">Advanced 3D Modeling Platform</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              Create, edit, and collaborate on Building Information Models with precision
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our advanced 3D modeling tools bring your construction projects to life with real-time updates, 
              cloud rendering, and seamless collaboration.
            </p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
              <p className="text-base font-semibold text-purple-300">
                Precision modeling with real-time collaboration and cloud rendering.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group">
              START MODELING
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white hover:text-black transition-colors">
              VIEW GALLERY
            </button>
          </div>
        </div>
      )
    },
    {
      id: '360-tour-builder',
      title: '360° TOUR BUILDER',
      subtitle: 'Immersive Virtual Experiences',
      description: 'Create interactive 360° tours and virtual walkthroughs for your construction projects.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-8xl mb-6 font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              🔄
            </div>
            <p className="text-2xl font-bold mb-2">360° TOUR BUILDER</p>
            <p className="text-lg text-gray-300">Immersive Virtual Experiences</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              Create interactive 360° tours and virtual walkthroughs
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Immerse clients and stakeholders in your vision with cutting-edge virtual reality technology 
              and interactive hotspot experiences.
            </p>
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-lg border border-cyan-500/30">
              <p className="text-base font-semibold text-cyan-300">
                VR headset support and interactive hotspots for maximum engagement.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group">
              CREATE TOUR
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white hover:text-black transition-colors">
              VIEW EXAMPLES
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'content-creation',
      title: 'CONTENT CREATION',
      subtitle: 'Professional Media Production',
      description: 'Create high-quality images, videos, and interactive content for your construction projects.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-8xl mb-6 font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🎬
            </div>
            <p className="text-2xl font-bold mb-2">CONTENT CREATION</p>
            <p className="text-lg text-gray-300">Professional Media Production</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              Create high-quality images, videos, and interactive content
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Professional media production tools to showcase your work and engage your audience 
              with stunning visual content and interactive presentations.
            </p>
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-lg border border-orange-500/30">
              <p className="text-base font-semibold text-orange-300">
                4K video editing and photo enhancement for maximum impact.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group">
              START CREATING
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white hover:text-black transition-colors">
              VIEW PORTFOLIO
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'geospatial-robotics',
      title: 'GEOSPATIAL & ROBOTICS',
      subtitle: 'Advanced Automation & Mapping',
      description: 'Leverage drone technology, GPS mapping, and robotic automation for precise construction operations.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-8xl mb-6 font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              🤖
            </div>
            <p className="text-2xl font-bold mb-2">GEOSPATIAL & ROBOTICS</p>
            <p className="text-lg text-gray-300">Advanced Automation Platform</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              Leverage drone technology, GPS mapping, and robotic automation
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Advanced geospatial tools and robotics to optimize your construction workflow 
              with precise site monitoring and automated operations.
            </p>
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 rounded-lg border border-red-500/30">
              <p className="text-base font-semibold text-red-300">
                Drone surveying and robotic automation for maximum precision.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group">
              EXPLORE AUTOMATION
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white hover:text-black transition-colors">
              VIEW DEMOS
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'reports-analytics',
      title: 'REPORTS & ANALYTICS',
      subtitle: 'Data-Driven Insights',
      description: 'Advanced analytics and reporting tools for informed decision-making and project optimization.',
      viewer: (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>
          <div className="text-center text-white relative z-10">
            <div className="text-8xl mb-6 font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              📈
            </div>
            <p className="text-2xl font-bold mb-2">REPORTS & ANALYTICS</p>
            <p className="text-lg text-gray-300">Data-Driven Insights Dashboard</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white leading-tight">
              Advanced analytics and reporting tools for informed decision-making
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Transform your construction data into actionable insights with real-time metrics, 
              custom reports, and predictive analytics for optimal project performance.
            </p>
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-lg border border-cyan-500/30">
              <p className="text-base font-semibold text-cyan-300">
                Real-time metrics and predictive analytics for maximum efficiency.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center group">
              VIEW ANALYTICS
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white hover:text-black transition-colors">
              GENERATE REPORTS
            </button>
          </div>
        </div>
      )
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which tile should be active based on scroll position
      let activeIndex = 0;
      
      for (let i = 0; i < tiles.length; i++) {
        const tileTop = i * windowHeight;
        const tileBottom = (i + 1) * windowHeight;
        
        if (scrollTop >= tileTop && scrollTop < tileBottom) {
          activeIndex = i;
          break;
        }
      }
      
      // Also check if we're at the very bottom (last tile)
      if (scrollTop >= (tiles.length - 1) * windowHeight) {
        activeIndex = tiles.length - 1;
      }
      
      if (activeIndex !== currentTile) {
        setCurrentTile(activeIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tiles.length, currentTile]);

  const scrollToTile = (index: number) => {
    const element = document.getElementById(tiles[index].id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setCurrentTile(index);
    }
  };

  const scrollToNext = () => {
    if (currentTile < tiles.length - 1) {
      scrollToTile(currentTile + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-x-hidden">

      {/* Horizontal Line Navigation - Boring Company Style */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 -translate-y-9 z-40">
        <div className="flex flex-col items-center space-y-3">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => scrollToTile(index)}
              className={`transition-all duration-500 ${
                index === currentTile 
                  ? 'bg-white' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
              style={{
                width: index === currentTile ? '24px' : '16px',
                height: '2px',
                borderRadius: '1px'
              }}
              aria-label={`Go to ${tile.title}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div ref={tilesRef} className="tiles-container">
        {tiles.map((tile, index) => {
          // Define sophisticated background gradients for each tile
          const tileBackgrounds = [
            'bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20', // SLATE360 - Blue/Indigo
            'bg-gradient-to-br from-emerald-900/20 via-green-900/30 to-teal-900/20', // PROJECT HUB - Green/Emerald
            'bg-gradient-to-br from-purple-900/20 via-violet-900/30 to-pink-900/20', // BIM STUDIO - Purple/Violet
            'bg-gradient-to-br from-cyan-900/20 via-blue-900/30 to-indigo-900/20', // 360° TOUR - Cyan/Blue
            'bg-gradient-to-br from-orange-900/20 via-red-900/30 to-pink-900/20', // CONTENT CREATION - Orange/Red
            'bg-gradient-to-br from-red-900/20 via-rose-900/30 to-purple-900/20', // GEOSPATIAL - Red/Rose
            'bg-gradient-to-br from-slate-800/20 via-gray-800/30 to-zinc-800/20' // REPORTS - Slate/Gray
          ];
          
          return (
          <div key={tile.id} className={`tile-item ${tileBackgrounds[index]}`}>
            <section id={tile.id} className="w-full max-w-6xl mx-auto px-4 py-8 relative" style={{ minHeight: '100vh', paddingTop: '120px' }}>
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none"></div>
              {/* Title Section */}
              <div className="text-center mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                  {tile.title}
                </h1>
                {tile.subtitle && (
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-300 mb-3">
                    {tile.subtitle}
                  </h2>
                )}
                {tile.description && (
                  <p className="text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
                    {tile.description}
                  </p>
                )}
              </div>

              {/* Content Layout - Optimized */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Viewer Side */}
                {tile.viewer && (
                  <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="w-full h-[300px] rounded-lg overflow-hidden">
                      {tile.viewer}
                    </div>
                  </div>
                )}
                
                {/* Content Side */}
                <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="h-[300px] flex items-center">
                    {tile.content}
                  </div>
                </div>
              </div>

              {/* Top Chevron - Only show if not first tile */}
              {index > 0 && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() => scrollToTile(index - 1)}
                    className="group flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors mx-auto"
                  >
                    <div className="w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-all duration-300">
                      <ChevronDown className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">PREV: {tiles[index - 1].title}</span>
                  </button>
                </div>
              )}

              {/* Bottom Chevron - Only show if not last tile */}
              {index < tiles.length - 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() => scrollToTile(index + 1)}
                    className="group flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors mx-auto"
                  >
                    <div className="w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-all duration-300">
                      <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">NEXT: {tiles[index + 1].title}</span>
                  </button>
                </div>
              )}

              {/* Footer - Only show on last tile */}
              {index === tiles.length - 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
                  <div className="bg-gradient-to-t from-black/80 via-gray-900/60 to-transparent backdrop-blur-sm rounded-t-lg border-t border-gray-700/50 p-6">
                    <div className="text-center space-y-4">
                      {/* Company Info */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">SLATE360</h3>
                        <p className="text-sm text-gray-400">
                          The future of construction technology. Transform how you build with advanced 3D modeling, 
                          real-time collaboration, and immersive technologies.
                        </p>
                      </div>

                      {/* Legal Links */}
                      <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                        <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
                        <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
                        <Link href="/accessibility" className="hover:text-gray-300 transition-colors">Accessibility</Link>
                        <Link href="/security" className="hover:text-gray-300 transition-colors">Security</Link>
                        <Link href="/compliance" className="hover:text-gray-300 transition-colors">Compliance</Link>
                      </div>

                      {/* Copyright */}
                      <div className="pt-2 border-t border-gray-700/50">
                        <p className="text-xs text-gray-500">
                          © {new Date().getFullYear()} SLATE360. All rights reserved. | Built with innovation for the construction industry.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        })}
      </div>

    </div>
  );
}
/ /   T E S T   C H A N G E   -   D E L E T E   T H I S 
 
 
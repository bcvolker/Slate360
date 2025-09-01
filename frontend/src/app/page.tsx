'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic imports for viewers
const ThreeModelViewer = dynamic(() => import('@/components/ThreeModelViewer'), { ssr: false });

export default function Homepage() {
  const [currentTile, setCurrentTile] = useState(0);
  const tilesRef = useRef<HTMLDivElement>(null);

  const tiles = [
    {
      id: 'slate360',
      title: 'SLATE360',
      subtitle: 'The Future of Construction Technology',
      description: 'Experience the next generation of construction workflows, 3D modeling, and immersive technologies in one unified platform.',
      viewer: (
        <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <ThreeModelViewer />
        </div>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Welcome to SLATE360 - where innovation meets construction. Our platform combines cutting-edge 3D visualization, 
            advanced project management, and immersive technologies to revolutionize how you build.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Key Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Advanced 3D modeling and visualization</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Real-time collaboration tools</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Immersive virtual experiences</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold border border-white/20 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'project-hub',
      title: 'Project Hub',
      subtitle: 'Centralized Project Management',
      description: 'Manage all your construction projects from one powerful dashboard with real-time collaboration and advanced tracking.',
      viewer: (
        <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg">Project Dashboard Viewer</p>
            <p className="text-sm">Interactive project management interface</p>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Centralize all your construction projects in one powerful dashboard. Track progress, manage teams, 
            and collaborate in real-time with advanced project management tools.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Project Management Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Real-time project tracking</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Team collaboration tools</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Document management</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Progress analytics</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'bim-studio',
      title: 'BIM Studio',
      subtitle: 'Advanced 3D Modeling',
      description: 'Create, edit, and collaborate on Building Information Models with precision and real-time updates.',
      viewer: (
        <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-lg">BIM Studio Video</p>
            <p className="text-sm">Watch BIM features in action</p>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Create, edit, and collaborate on Building Information Models with precision and real-time updates. 
            Our advanced 3D modeling tools bring your construction projects to life.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">BIM Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>3D model creation</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Real-time collaboration</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Version control</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Cloud rendering</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: '360-tour-builder',
      title: '360° Tour Builder',
      subtitle: 'Immersive Virtual Experiences',
      description: 'Create interactive 360° tours and virtual walkthroughs for your construction projects.',
      viewer: (
        <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-lg">360° Tour Viewer</p>
            <p className="text-sm">Interactive virtual tour experience</p>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Create interactive 360° tours and virtual walkthroughs for your construction projects. 
            Immerse clients and stakeholders in your vision with cutting-edge virtual reality technology.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">360° Tour Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>360° photo stitching</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Interactive hotspots</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>VR headset support</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Client sharing</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      subtitle: 'Professional Media Production',
      description: 'Create high-quality images, videos, and interactive content for your construction projects.',
      viewer: (
        <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg">Content Creation Video</p>
            <p className="text-sm">See media production features</p>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Create high-quality images, videos, and interactive content for your construction projects. 
            Professional media production tools to showcase your work and engage your audience.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Content Creation Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>4K video editing</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Photo enhancement</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Interactive presentations</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Asset management</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'geospatial-robotics',
      title: 'Geospatial & Robotics',
      subtitle: 'Advanced Automation & Mapping',
      description: 'Leverage drone technology, GPS mapping, and robotic automation for precise construction operations.',
      viewer: (
        <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Robotics & Mapping Viewer</p>
            <p className="text-sm">Drone and automation interface</p>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Leverage drone technology, GPS mapping, and robotic automation for precise construction operations. 
            Advanced geospatial tools and robotics to optimize your construction workflow.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Automation Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Drone surveying</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>GPS mapping</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Robotic automation</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Site monitoring</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'reports-analytics',
      title: 'Reports & Analytics',
      subtitle: 'Data-Driven Insights',
      description: 'Advanced analytics and reporting tools for informed decision-making and project optimization.',
      viewer: null, // No viewer for last tile
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">
            Advanced analytics and reporting tools for informed decision-making and project optimization. 
            Transform your construction data into actionable insights.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Analytics Features:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                <span>Real-time metrics</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                <span>Custom reports</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                <span>Performance tracking</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                <span>Predictive analytics</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating Navigation - Redesigned */}
      <div className="fixed right-12 top-40 z-50">
        <div className="flex flex-col space-y-2">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => scrollToTile(index)}
              className={`text-right transition-all duration-300 group ${
                index === currentTile 
                  ? 'text-blue-400 font-semibold' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              aria-label={`Go to ${tile.title}`}
            >
              <div className="text-xs font-medium leading-tight">
                {tile.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div ref={tilesRef} className="tiles-container">
        {tiles.map((tile, index) => (
          <div key={tile.id} className="tile-item">
            <section id={tile.id} className="w-full max-w-7xl mx-auto px-8">
              {/* Title Section */}
              <div className="text-center mb-12">
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
                  {tile.title}
                </h1>
                {tile.subtitle && (
                  <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
                    {tile.subtitle}
                  </h2>
                )}
                {tile.description && (
                  <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    {tile.description}
                  </p>
                )}
              </div>

              {/* Content Layout - Alternating Sides */}
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Viewer Side */}
                {tile.viewer && (
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="w-full h-96 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                      {tile.viewer}
                    </div>
                  </div>
                )}
                
                {/* Content Side */}
                <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="h-96 flex items-center">
                    {tile.content}
                  </div>
                </div>
              </div>

              {/* Chevron for next tile (except last) */}
              {index < tiles.length - 1 && (
                <div className="text-center pt-8">
                  <button
                    onClick={scrollToNext}
                    className="group flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors mx-auto"
                  >
                    <ChevronDown className="w-8 h-8 animate-bounce group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Next: {tiles[index + 1].title}</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        ))}
      </div>

      {/* Compact Footer - Only on last tile */}
      <footer className="bg-black/90 backdrop-blur-md py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            {/* Links */}
            <div className="flex justify-center space-x-6 text-sm footer-links">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} SLATE360. All rights reserved. | 
              <Link href="/terms" className="text-blue-400 hover:text-blue-300 ml-1 underline">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

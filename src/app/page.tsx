'use client';

import { CleanHeader } from '@/components/CleanHeader';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import Link from 'next/link';
import { ArrowRight, Code, Video, Bot, BarChart, HardHat, Orbit, ChevronUp, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const tiles = [
    { 
      id: 'home', 
      title: 'SLATE360', 
      subtitle: 'The Future of Construction Technology', 
      description: 'Our platform combines cutting-edge 3D visualization, advanced project management, and immersive technologies to revolutionize how you build.',
      detailedDescription: 'SLATE360 creates safe, efficient, and intelligent construction workflows with advanced 3D modeling, real-time collaboration, and immersive technologies.',
      highlightText: 'The mission: solve construction complexity, enable rapid project delivery, and transform how we build.',
      Icon: Code, 
      gradient: 'from-blue-600/20 to-blue-900/30',
      accentColor: 'blue',
      buttonText: 'GET STARTED',
      secondaryButtonText: 'VIEW DEMO'
    },
    { 
      id: 'project-hub', 
      title: 'PROJECT HUB', 
      subtitle: 'Centralized Project Management', 
      description: 'Manage all your construction projects from one powerful dashboard with real-time collaboration and advanced tracking.',
      detailedDescription: 'Track progress, manage teams, and collaborate in real-time with advanced project management tools designed for modern construction workflows.',
      highlightText: 'Real-time collaboration and advanced tracking for maximum efficiency.',
      Icon: HardHat, 
      gradient: 'from-emerald-600/20 to-emerald-900/30',
      accentColor: 'emerald',
      buttonText: 'EXPLORE PROJECTS',
      secondaryButtonText: 'VIEW ANALYTICS'
    },
    { 
      id: 'bim-studio', 
      title: 'BIM STUDIO', 
      subtitle: 'Advanced 3D Modeling', 
      description: 'Create, edit, and collaborate on Building Information Models with precision and real-time updates.',
      detailedDescription: 'Our advanced 3D modeling tools bring your construction projects to life with real-time updates, cloud rendering, and seamless collaboration.',
      highlightText: 'Precision modeling with real-time collaboration and cloud rendering.',
      Icon: Orbit, 
      gradient: 'from-purple-600/20 to-purple-900/30',
      accentColor: 'purple',
      buttonText: 'START MODELING',
      secondaryButtonText: 'VIEW GALLERY'
    },
    { 
      id: 'content-creation', 
      title: 'CONTENT CREATION', 
      subtitle: 'Professional Media Production', 
      description: 'Create high-quality images, videos, and interactive content for your construction projects.',
      detailedDescription: 'Professional media production tools to showcase your work and engage your audience with stunning visual content and interactive presentations.',
      highlightText: '4K video editing and photo enhancement for maximum impact.',
      Icon: Video, 
      gradient: 'from-orange-600/20 to-orange-900/30',
      accentColor: 'orange',
      buttonText: 'START CREATING',
      secondaryButtonText: 'VIEW PORTFOLIO'
    },
    { 
      id: 'geospatial', 
      title: 'GEOSPATIAL & ROBOTICS', 
      subtitle: 'Advanced Automation & Mapping', 
      description: 'Leverage drone technology, GPS mapping, and robotic automation for precise construction operations.',
      detailedDescription: 'Advanced geospatial tools and robotics to optimize your construction workflow with precise site monitoring and automated operations.',
      highlightText: 'Drone surveying and robotic automation for maximum precision.',
      Icon: Bot, 
      gradient: 'from-pink-600/20 to-pink-900/30',
      accentColor: 'pink',
      buttonText: 'EXPLORE AUTOMATION',
      secondaryButtonText: 'VIEW DEMOS'
    },
    { 
      id: 'reports', 
      title: 'REPORTS & ANALYTICS', 
      subtitle: 'Data-Driven Insights', 
      description: 'Advanced analytics and reporting tools for informed decision-making and project optimization.',
      detailedDescription: 'Transform your construction data into actionable insights with real-time metrics, custom reports, and predictive analytics for optimal project performance.',
      highlightText: 'Real-time metrics and predictive analytics for maximum efficiency.',
      Icon: BarChart, 
      gradient: 'from-cyan-600/20 to-cyan-900/30',
      accentColor: 'cyan',
      buttonText: 'VIEW REPORTS',
      secondaryButtonText: 'EXPLORE ANALYTICS'
    },
    { 
      id: 'vr-studio', 
      title: 'VIRTUAL REALITY STUDIO', 
      subtitle: 'Immersive Experiences', 
      description: 'Step into your projects before they are built with immersive VR walkthroughs and simulations.',
      detailedDescription: 'Create immersive virtual reality experiences that allow stakeholders to walk through projects before construction begins.',
      highlightText: 'Immersive VR walkthroughs and simulations for maximum engagement.',
      Icon: Orbit, 
      gradient: 'from-indigo-600/20 to-indigo-900/30',
      accentColor: 'indigo',
      buttonText: 'ENTER VR',
      secondaryButtonText: 'VIEW EXPERIENCES'
    }
  ];

  return (
    <>
      <CleanHeader />
      
      {/* Scroll up indicator */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
        <button className="bg-white/10 backdrop-blur-lg rounded-full p-2 hover:bg-white/20 transition-colors">
          <ChevronUp className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Navigation dots */}
      <nav className="nav-dots">
        {tiles.map(tile => <a key={tile.id} href={`#${tile.id}`}></a>)}
      </nav>

      {/* Scroll down indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button className="bg-white/10 backdrop-blur-lg rounded-full p-2 hover:bg-white/20 transition-colors">
          <ChevronDown className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="scroll-container">
        {tiles.map((tile, index) => (
          <section key={tile.id} id={tile.id} className={`scroll-section relative overflow-hidden pt-20`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-50`}></div>
            <div className="container relative z-10 px-4 md:px-6 h-full flex items-center">
              <div className="grid md:grid-cols-2 gap-12 items-center w-full min-h-[600px]">
                {/* Content and Card - alternating sides */}
                {index % 2 === 0 ? (
                  <>
                    {/* Left content */}
                    <div className="space-y-6 flex flex-col justify-center h-full">
                      <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white uppercase">{tile.title}</h1>
                        <h2 className="text-xl font-medium text-gray-300 mt-3">{tile.subtitle}</h2>
                        <p className="text-gray-400 mt-4 max-w-[600px] text-base md:text-lg">{tile.description}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">{tile.detailedDescription}</h3>
                        <p className="text-gray-300 max-w-[600px] text-base">{tile.description}</p>
                        
                        <div className={`bg-${tile.accentColor}-500/20 border border-${tile.accentColor}-500/30 rounded-lg p-4 max-w-[500px]`}>
                          <p className="text-white font-medium text-base">{tile.highlightText}</p>
                        </div>
                        
                        <div className="flex gap-4 flex-wrap">
                          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                            {tile.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                            {tile.secondaryButtonText}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Right content - Feature card */}
                    <div className="flex justify-center md:justify-end">
                      <SurfaceCard className="p-8 bg-black/20 backdrop-blur-lg border-white/10 w-full max-w-md h-80">
                        <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                          <tile.Icon className={`h-24 w-24 text-${tile.accentColor}-500`} />
                          <div>
                            <h3 className="text-2xl font-bold text-white uppercase">{tile.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">{tile.subtitle}</p>
                          </div>
                          <div className={`w-16 h-1 bg-${tile.accentColor}-500 rounded-full`}></div>
                        </div>
                      </SurfaceCard>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left content - Feature card */}
                    <div className="flex justify-center md:justify-start">
                      <SurfaceCard className="p-8 bg-black/20 backdrop-blur-lg border-white/10 w-full max-w-md h-80">
                        <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
                          <tile.Icon className={`h-24 w-24 text-${tile.accentColor}-500`} />
                          <div>
                            <h3 className="text-2xl font-bold text-white uppercase">{tile.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">{tile.subtitle}</p>
                          </div>
                          <div className={`w-16 h-1 bg-${tile.accentColor}-500 rounded-full`}></div>
                        </div>
                      </SurfaceCard>
                    </div>

                    {/* Right content */}
                    <div className="space-y-6 flex flex-col justify-center h-full">
                      <div className="text-center md:text-right">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white uppercase">{tile.title}</h1>
                        <h2 className="text-xl font-medium text-gray-300 mt-3">{tile.subtitle}</h2>
                        <p className="text-gray-400 mt-4 max-w-[600px] text-base md:text-lg">{tile.description}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">{tile.detailedDescription}</h3>
                        <p className="text-gray-300 max-w-[600px] text-base">{tile.description}</p>
                        
                        <div className={`bg-${tile.accentColor}-500/20 border border-${tile.accentColor}-500/30 rounded-lg p-4 max-w-[500px]`}>
                          <p className="text-white font-medium text-base">{tile.highlightText}</p>
                        </div>
                        
                        <div className="flex gap-4 flex-wrap">
                          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                            {tile.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                            {tile.secondaryButtonText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
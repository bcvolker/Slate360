'use client';
import React from 'react';
import { CheckCircle2, ArrowRight, Play, Star, Users, Zap, Shield } from 'lucide-react';
import { CleanHeader } from '@/components/CleanHeader';

const FEATURES = [
  {
    id: 'project-hub',
    title: 'Project Hub',
    subtitle: 'Centralized project management',
    description: 'Streamline your construction projects with intelligent planning, real-time tracking, and seamless team coordination.',
    features: ['RFI & Submittal Tracking', 'Document Version Control', 'Team Collaboration Tools', 'Progress Analytics'],
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    layout: 'left'
  },
  {
    id: 'bim-studio',
    title: 'BIM Studio',
    subtitle: 'Advanced 3D modeling & analysis',
    description: 'Transform your construction process with cutting-edge BIM technology, real-time clash detection, and immersive 3D visualization.',
    features: ['Real-time Clash Detection', 'Live Annotations & Markups', '3D Model Integration', 'Automated Reports'],
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    layout: 'right'
  },
  {
    id: 'content',
    title: 'Content Creation',
    subtitle: 'AI-powered media editing',
    description: 'Create stunning visual content with AI-enhanced tools, magnetic video timelines, and professional-grade editing capabilities.',
    features: ['Magnetic Video Timeline', 'AI Photo Enhancement', 'Automated Captions', 'Brand Consistency Tools'],
    icon: Play,
    gradient: 'from-emerald-500 to-teal-500',
    layout: 'left'
  },
  {
    id: 'tours',
    title: '360° Tours',
    subtitle: 'Immersive site walkthroughs',
    description: 'Create captivating virtual tours with interactive hotspots, one-click VR export, and seamless integration with your projects.',
    features: ['Interactive Hotspots', 'One-Click VR Export', 'Virtual Site Visits', 'Client Presentations'],
    icon: Star,
    gradient: 'from-orange-500 to-red-500',
    layout: 'right'
  }
];

const STATS = [
  { label: 'Projects Completed', value: '10,000+' },
  { label: 'Active Users', value: '50,000+' },
  { label: 'Time Saved', value: '40%' },
  { label: 'Client Satisfaction', value: '98%' }
];

export default function HomePage() {
  return (
    <>
      <CleanHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build Smarter with{' '}
              <span className="gradient-text">Slate360</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              The complete construction technology platform that transforms how you manage projects, 
              collaborate with teams, and deliver exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-10 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="btn-secondary text-lg px-10 py-4">
                Watch Demo
                <Play className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for{' '}
              <span className="gradient-text">Modern Construction</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your construction projects, from initial planning to final delivery.
            </p>
          </div>

          <div className="space-y-32">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={`${feature.layout === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="feature-card">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-xl text-gray-600 mb-6">{feature.subtitle}</p>
                      <p className="text-gray-700 mb-8 leading-relaxed">{feature.description}</p>
                      <ul className="space-y-3">
                        {feature.features.map((item) => (
                          <li key={item} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className={`${feature.layout === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative">
                      <div className={`aspect-square bg-gradient-to-br ${feature.gradient} rounded-3xl shadow-2xl flex items-center justify-center`}>
                        <div className="text-center text-white">
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IconComponent className="w-12 h-12" />
                          </div>
                          <p className="text-xl font-semibold">Interactive Demo</p>
                          <p className="text-white/80">{feature.title}</p>
                        </div>
                      </div>
                      {/* Floating elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Construction Process?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of construction professionals who are already building smarter with Slate360.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-10 py-4 rounded-xl transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-xl">Slate360</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The complete construction technology platform that transforms how you manage projects, 
                collaborate with teams, and deliver exceptional results.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Slate360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
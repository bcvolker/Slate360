'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Zap,
  FolderOpen,
  Globe,
  Building2,
  MapPin,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const tiles = [
  { 
    title: 'Overview', 
    description: 'All-in-one platform for construction workflows.',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    href: '/dashboard',
    tier: 'free'
  },
  { 
    title: '3D Modeling', 
    description: 'Create and navigate digital twins.',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    href: '/dashboard/3d-modeling',
    tier: 'premium'
  },
  { 
    title: 'Project Hub', 
    description: 'Manage multiple projects and documents.',
    icon: FolderOpen,
    color: 'from-green-500 to-emerald-500',
    href: '/dashboard/project-hub',
    tier: 'free'
  },
  { 
    title: '360 Tours', 
    description: 'Build and host immersive tours.',
    icon: Globe,
    color: 'from-orange-500 to-red-500',
    href: '/dashboard/360-tours',
    tier: 'premium'
  },
  { 
    title: 'BIM Studio', 
    description: 'Revit-style modeling and analysis.',
    icon: Building2,
    color: 'from-indigo-500 to-purple-500',
    href: '/dashboard/bim-studio',
    tier: 'premium'
  },
  { 
    title: '3D Print', 
    description: 'Prepare and queue 3D prints.',
    icon: Zap,
    color: 'from-teal-500 to-blue-500',
    href: '/dashboard/3d-print',
    tier: 'enterprise'
  },
  { 
    title: 'VR/AR', 
    description: 'Virtual inspections and staging.',
    icon: Globe,
    color: 'from-pink-500 to-rose-500',
    href: '/dashboard/vr-ar',
    tier: 'enterprise'
  },
  { 
    title: 'Geospatial', 
    description: 'Drone missions and site analysis.',
    icon: MapPin,
    color: 'from-yellow-500 to-orange-500',
    href: '/dashboard/geospatial',
    tier: 'enterprise'
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '3 projects',
      'Basic 3D viewer',
      '1GB storage',
      'Community support'
    ],
    buttonText: 'Get Started',
    buttonHref: '/auth/signin',
    popular: false
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/month',
    description: 'For growing teams',
    features: [
      '25 projects',
      'Advanced 3D modeling',
      '360° tours',
      '100GB storage',
      'Priority support',
      'API access'
    ],
    buttonText: 'Start Premium',
    buttonHref: '/pricing',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited projects',
      'Full BIM suite',
      'VR/AR support',
      'Geospatial tools',
      'Unlimited storage',
      '24/7 dedicated support',
      'White-label options'
    ],
    buttonText: 'Contact Sales',
    buttonHref: '/contact',
    popular: false
  }
];

export default function Homepage() {
  const [showLogin, setShowLogin] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                SLATE360
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {session ? (
                <Link 
                  href="/dashboard"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hero Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-4xl">S</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                SLATE360
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              The all-in-one platform for construction project management, 3D modeling, and immersive experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link 
                  href="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              )}
              <Link 
                href="/pricing"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Tiles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Every Project
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From concept to completion, SLATE360 provides the tools you need to succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiles.map((tile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group"
              >
                <Link href={tile.href}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tile.color} flex items-center justify-center mb-4`}>
                      <tile.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{tile.title}</h3>
                    <p className="text-slate-600 mb-4">{tile.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 capitalize">{tile.tier} tier</span>
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include core features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + 0.1 * index }}
                className={`bg-white rounded-xl p-8 shadow-lg border-2 ${
                  tier.popular ? 'border-blue-500 relative' : 'border-slate-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                    <span className="text-slate-600">{tier.period}</span>
                  </div>
                  <p className="text-slate-600">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.buttonHref}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tier.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Projects?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who trust SLATE360 for their construction needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session && (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Start Free Trial
                </button>
              )}
              <Link 
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">SLATE360</span>
              </div>
              <p className="text-slate-400">
                Transforming construction through technology and innovation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 SLATE360. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal would go here */}
    </div>
  );
}

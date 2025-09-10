'use client';
import React from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export const CleanHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl gradient-text">Slate360</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </a>
            <button className="btn-primary">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
              <button className="btn-primary w-full mt-4">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
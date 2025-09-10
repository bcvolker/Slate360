'use client';

import { useState } from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { ChevronLeft, ChevronRight, RotateCcw, Map } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface TourViewerProps {
  title: string;
  steps: TourStep[];
  className?: string;
}

export function TourViewer({ title, steps, className }: TourViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const resetTour = () => {
    setCurrentStep(0);
  };

  const tools = [
    {
      label: 'Previous',
      action: prevStep,
      helpText: 'Go to previous step',
      icon: <ChevronLeft size={16} />
    },
    {
      label: 'Next',
      action: nextStep,
      helpText: 'Go to next step',
      icon: <ChevronRight size={16} />
    },
    {
      label: 'Reset',
      action: resetTour,
      helpText: 'Start tour from beginning',
      icon: <RotateCcw size={16} />
    },
    {
      label: 'Overview',
      action: () => {},
      helpText: 'Show tour overview',
      icon: <Map size={16} />
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <SurfaceCard className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
          <img 
            src={currentStepData.imageUrl} 
            alt={currentStepData.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
            <h4 className="font-semibold">{currentStepData.title}</h4>
            <p className="text-sm opacity-90">{currentStepData.description}</p>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        <ContextualToolbar tools={tools} />
      </div>
    </SurfaceCard>
  );
}
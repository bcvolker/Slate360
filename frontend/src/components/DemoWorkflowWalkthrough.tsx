import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle, 
  Circle, 
  X, 
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  FileText,
  Users,
  BarChart3,
  Upload,
  Plus
} from 'lucide-react';
import { demoWorkflowSteps } from '../lib/demo/demoData';
import { toast } from 'react-hot-toast';

interface DemoWorkflowWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onStepComplete: (stepId: string) => void;
  className?: string;
}

export function DemoWorkflowWalkthrough({
  isOpen,
  onClose,
  onStepComplete,
  className = ''
}: DemoWorkflowWalkthroughProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState(true);

  const currentStep = demoWorkflowSteps[currentStepIndex];
  const totalSteps = demoWorkflowSteps.length;
  const progress = (completedSteps.size / totalSteps) * 100;

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        handleNextStep();
      } else {
        setIsPlaying(false);
        toast.success('Workflow walkthrough completed! 🎉');
      }
    }, 8000); // 8 seconds per step

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps]);

  // Handle step completion
  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set(Array.from(prev).concat(stepId)));
    onStepComplete(stepId);
    
    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        handleNextStep();
      }
    }, 1500);
  };

  // Navigation functions
  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkipToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  // Play/pause functionality
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset walkthrough
  const resetWalkthrough = () => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  };

  // Get step icon based on step ID
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'welcome':
        return <Lightbulb size={20} />;
      case 'explore_projects':
        return <FileText size={20} />;
      case 'create_project':
        return <Plus size={20} />;
      case 'upload_files':
        return <Upload size={20} />;
      case 'team_collaboration':
        return <Users size={20} />;
      case 'tracking_progress':
        return <BarChart3 size={20} />;
      case 'reports_analytics':
        return <BarChart3 size={20} />;
      default:
        return <Circle size={20} />;
    }
  };

  // Get step-specific hints
  const getStepHints = (stepId: string) => {
    switch (stepId) {
      case 'welcome':
        return [
          'Take your time to explore each section',
          'Click on different elements to see how they work',
          'Use the navigation menu to switch between features'
        ];
      case 'explore_projects':
        return [
          'Click on project cards to see detailed views',
          'Try filtering projects by status or type',
          'Use the search function to find specific projects'
        ];
      case 'create_project':
        return [
          'Fill in all required fields marked with *',
          'Upload sample files to test the system',
          'Add team members to see collaboration features'
        ];
      case 'upload_files':
        return [
          'Drag and drop files onto the upload area',
          'Try different file types (PDF, images, documents)',
          'Check the file preview and metadata'
        ];
      case 'team_collaboration':
        return [
          'Invite team members to projects',
          'Assign roles and permissions',
          'Use the comment system for communication'
        ];
      case 'tracking_progress':
        return [
          'Update milestone completion status',
          'Track budget vs. actual spending',
          'Monitor project timeline and delays'
        ];
      case 'reports_analytics':
        return [
          'Generate different types of reports',
          'Export data in various formats',
          'Use filters to customize your view'
        ];
      default:
        return ['Explore the feature and try different options'];
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Walkthrough Modal */}
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Demo Workflow Walkthrough</h2>
              <p className="text-blue-100 mt-1">
                Step {currentStepIndex + 1} of {totalSteps} • {currentStep.duration}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Step */}
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {getStepIcon(currentStep.id)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
            </div>
          </div>

          {/* Hints Section */}
          {showHints && (
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb size={20} className="text-blue-600" />
                <h4 className="font-semibold text-blue-900">Pro Tips</h4>
              </div>
              <ul className="space-y-2">
                {getStepHints(currentStep.id).map((hint, index) => (
                  <li key={index} className="flex items-start space-x-2 text-blue-800">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{hint}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlayPause}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${isPlaying 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  }
                `}
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} className="inline mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={16} className="inline mr-2" />
                    Auto-play
                  </>
                )}
              </button>

              <button
                onClick={() => setShowHints(!showHints)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                {showHints ? 'Hide' : 'Show'} Tips
              </button>

              <button
                onClick={resetWalkthrough}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                onClick={() => handleStepComplete(currentStep.id)}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Mark Complete
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === totalSteps - 1}
                className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700">Step Navigation</h4>
            <span className="text-sm text-gray-500">
              {completedSteps.size} of {totalSteps} completed
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {demoWorkflowSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleSkipToStep(index)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${index === currentStepIndex
                    ? 'bg-blue-500 text-white shadow-md'
                    : completedSteps.has(step.id)
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle size={16} />
                ) : (
                  <Circle size={16} />
                )}
                <span>{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DemoWorkflowWalkthrough;

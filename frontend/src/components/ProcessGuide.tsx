import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status?: 'pending' | 'active' | 'completed' | 'error';
  duration?: string;
  requirements?: string[];
  tips?: string[];
}

interface ProcessGuideProps {
  title: string;
  steps: ProcessStep[];
  variant?: 'default' | 'compact' | 'detailed';
  theme?: 'light' | 'dark' | 'blue' | 'green';
  maxHeight?: number;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  showStepNumbers?: boolean;
  showProgress?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

export function ProcessGuide({
  title,
  steps,
  variant = 'default',
  theme = 'light',
  maxHeight = 400,
  className = '',
  buttonClassName = '',
  panelClassName = '',
  showStepNumbers = true,
  showProgress = true,
  collapsible = true,
  defaultOpen = false,
  autoClose = false,
  autoCloseDelay = 10000,
  disabled = false,
  ariaLabel
}: ProcessGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout>();

  // Theme configurations
  const themeConfig = {
    light: {
      button: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      panel: 'bg-white border-gray-200 shadow-lg',
      header: 'bg-gray-50 border-gray-200',
      step: 'border-gray-200 hover:bg-gray-50',
      stepActive: 'border-blue-500 bg-blue-50',
      stepCompleted: 'border-green-500 bg-green-50',
      stepError: 'border-red-500 bg-red-50'
    },
    dark: {
      button: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600',
      panel: 'bg-gray-900 border-gray-600 shadow-xl',
      header: 'bg-gray-800 border-gray-600',
      step: 'border-gray-600 hover:bg-gray-800',
      stepActive: 'border-blue-400 bg-blue-900/20',
      stepCompleted: 'border-green-400 bg-green-900/20',
      stepError: 'border-red-400 bg-red-900/20'
    },
    blue: {
      button: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300',
      panel: 'bg-white border-blue-200 shadow-lg',
      header: 'bg-blue-50 border-blue-200',
      step: 'border-blue-200 hover:bg-blue-50',
      stepActive: 'border-blue-500 bg-blue-50',
      stepCompleted: 'border-green-500 bg-green-50',
      stepError: 'border-red-500 bg-red-50'
    },
    green: {
      button: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300',
      panel: 'bg-white border-green-200 shadow-lg',
      header: 'bg-green-50 border-green-200',
      step: 'border-green-200 hover:bg-green-50',
      stepActive: 'border-blue-500 bg-blue-50',
      stepCompleted: 'border-green-500 bg-green-50',
      stepError: 'border-red-500 bg-red-50'
    }
  };

  const currentTheme = themeConfig[theme];

  // Variant configurations
  const variantConfig = {
    default: { maxSteps: steps.length, showDetails: true },
    compact: { maxSteps: Math.min(5, steps.length), showDetails: false },
    detailed: { maxSteps: steps.length, showDetails: true }
  };

  const currentVariant = variantConfig[variant];
  const displaySteps = steps.slice(0, currentVariant.maxSteps);

  // Handle auto-close
  useEffect(() => {
    if (autoClose && isOpen) {
      autoCloseTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, autoCloseDelay);
    }

    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, [autoClose, isOpen, autoCloseDelay]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        panelRef.current && 
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Toggle panel
  const togglePanel = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // Handle step click
  const handleStepClick = (stepId: string) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  // Mark step as completed
  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.add(stepId);
      return newSet;
    });
  };

  // Mark step as error
  const markStepError = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.delete(stepId);
      return newSet;
    });
  };

  // Calculate progress
  const progress = showProgress ? (completedSteps.size / steps.length) * 100 : 0;

  // Get step status
  const getStepStatus = (step: ProcessStep) => {
    if (completedSteps.has(step.id)) return 'completed';
    if (activeStep === step.id) return 'active';
    if (step.status) return step.status;
    return 'pending';
  };

  // Get step status classes
  const getStepStatusClasses = (status: string) => {
    switch (status) {
      case 'active':
        return currentTheme.stepActive;
      case 'completed':
        return currentTheme.stepCompleted;
      case 'error':
        return currentTheme.stepError;
      default:
        return currentTheme.step;
    }
  };

  // Animation variants
  const panelVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      height: 'auto',
      scale: 1
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  const buttonVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { scale: 1.05, rotate: 2 },
    active: { scale: 0.95, rotate: -2 }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className={`process-guide-container relative ${className}`}>
      {/* Process Guide Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={togglePanel}
        disabled={disabled}
        className={`
          process-guide-button
          inline-flex items-center space-x-2
          px-4 py-2 rounded-lg border
          font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${currentTheme.button}
          ${buttonClassName}
        `}
        aria-label={ariaLabel || `Process guide for ${title}`}
        aria-expanded={isOpen}
        aria-controls="process-guide-panel"
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="active"
        animate={isOpen ? "active" : "idle"}
      >
        <BookOpen size={18} />
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.div>
      </motion.button>

      {/* Process Guide Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="process-guide-panel"
            className={`
              process-guide-panel
              absolute top-full left-0 mt-2 z-50
              w-96 max-w-sm
              ${currentTheme.panel}
              border rounded-lg
              ${panelClassName}
            `}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            role="dialog"
            aria-labelledby="process-guide-title"
            aria-describedby="process-guide-content"
          >
            {/* Header */}
            <div className={`
              flex items-center justify-between
              px-4 py-3 border-b
              ${currentTheme.header}
            `}>
              <h3 
                id="process-guide-title"
                className="text-lg font-semibold"
              >
                {title}
              </h3>
              <button
                onClick={togglePanel}
                className="
                  p-1 rounded-md
                  text-gray-500 hover:text-gray-700
                  hover:bg-gray-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors duration-200
                "
                aria-label="Close process guide"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress Bar */}
            {showProgress && (
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">
                    {completedSteps.size} of {steps.length} steps
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div 
              id="process-guide-content"
              className="p-4"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              <div className="space-y-3">
                {displaySteps.map((step, index) => {
                  const status = getStepStatus(step);
                  const statusClasses = getStepStatusClasses(status);
                  
                  return (
                    <motion.div
                      key={step.id}
                      custom={index}
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      className={`
                        process-step
                        border rounded-lg p-3 cursor-pointer
                        transition-all duration-200
                        ${statusClasses}
                      `}
                      onClick={() => handleStepClick(step.id)}
                    >
                      {/* Step Header */}
                      <div className="flex items-start space-x-3">
                        {showStepNumbers && (
                          <div className={`
                            flex-shrink-0 w-6 h-6 rounded-full
                            flex items-center justify-center text-xs font-bold
                            ${status === 'completed' ? 'bg-green-500 text-white' :
                              status === 'active' ? 'bg-blue-500 text-white' :
                              status === 'error' ? 'bg-red-500 text-white' :
                              'bg-gray-300 text-gray-600'}
                          `}>
                            {status === 'completed' ? '✓' : index + 1}
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {step.title}
                          </h4>
                          
                          {/* Step Description */}
                          <div className="text-sm text-gray-600 mb-2">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <span>{children}</span>,
                                strong: ({ children }) => (
                                  <strong className="font-semibold">{children}</strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic">{children}</em>
                                ),
                                code: ({ children }) => (
                                  <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
                                    {children}
                                  </code>
                                )
                              }}
                            >
                              {step.description}
                            </ReactMarkdown>
                          </div>

                          {/* Step Details (if detailed variant and step is active) */}
                          {currentVariant.showDetails && activeStep === step.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 pt-2 border-t border-gray-200"
                            >
                              {/* Duration */}
                              {step.duration && (
                                <div className="text-xs text-gray-500">
                                  <strong>Duration:</strong> {step.duration}
                                </div>
                              )}

                              {/* Requirements */}
                              {step.requirements && step.requirements.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">
                                    Requirements:
                                  </div>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {step.requirements.map((req, reqIndex) => (
                                      <li key={reqIndex} className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <span>{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Tips */}
                              {step.tips && step.tips.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-blue-700 mb-1">
                                    Tips:
                                  </div>
                                  <ul className="text-xs text-blue-600 space-y-1">
                                    {step.tips.map((tip, tipIndex) => (
                                      <li key={tipIndex} className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex space-x-2 pt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markStepCompleted(step.id);
                                  }}
                                  className="
                                    px-2 py-1 text-xs
                                    bg-green-500 text-white rounded
                                    hover:bg-green-600
                                    focus:outline-none focus:ring-2 focus:ring-green-500
                                    transition-colors duration-200
                                  "
                                >
                                  Mark Complete
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markStepError(step.id);
                                  }}
                                  className="
                                    px-2 py-1 text-xs
                                    bg-red-500 text-white rounded
                                    hover:bg-red-600
                                    focus:outline-none focus:ring-2 focus:ring-red-500
                                    transition-colors duration-200
                                  "
                                >
                                  Mark Error
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  {steps.length > currentVariant.maxSteps && (
                    <p>Showing {currentVariant.maxSteps} of {steps.length} steps</p>
                  )}
                  <p>Click on any step to see more details</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export default
export default ProcessGuide;

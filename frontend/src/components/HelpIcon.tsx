import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HelpIconProps {
  content: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  trigger?: 'click' | 'hover' | 'both';
  disabled?: boolean;
  ariaLabel?: string;
}

export function HelpIcon({
  content,
  title,
  size = 'md',
  position = 'top',
  maxWidth = 300,
  className = '',
  iconClassName = '',
  tooltipClassName = '',
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 5000,
  trigger = 'both',
  disabled = false,
  ariaLabel
}: HelpIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout>();

  // Size configurations
  const sizeConfig = {
    sm: { icon: 16, padding: 8 },
    md: { icon: 20, padding: 10 },
    lg: { icon: 24, padding: 12 }
  };

  const currentSize = sizeConfig[size];

  // Position configurations
  const positionConfig = {
    top: { 
      tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      arrow: 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
    },
    bottom: { 
      tooltip: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      arrow: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1'
    },
    left: { 
      tooltip: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      arrow: 'left-full top-1/2 transform -translate-y-1/2 -ml-1'
    },
    right: { 
      tooltip: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      arrow: 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
    }
  };

  const currentPosition = positionConfig[position];

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
        iconRef.current && 
        !iconRef.current.contains(event.target as Node) &&
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node)
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

  // Handle hover events
  const handleMouseEnter = () => {
    if (disabled) return;
    
    setIsHovered(true);
    if (trigger === 'hover' || trigger === 'both') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    setIsHovered(false);
    if (trigger === 'hover' || trigger === 'both') {
      // Small delay to prevent flickering
      setTimeout(() => {
        if (!isHovered) {
          setIsOpen(false);
        }
      }, 100);
    }
  };

  // Handle click events
  const handleClick = () => {
    if (disabled) return;
    
    if (trigger === 'click' || trigger === 'both') {
      setIsOpen(!isOpen);
    }
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle focus for keyboard navigation
  const handleFocus = () => {
    if (disabled) return;
    
    if (trigger === 'hover' || trigger === 'both') {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    
    // Small delay to allow focus to move to tooltip
    setTimeout(() => {
      if (!iconRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 100);
  };

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0
    }
  };

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    active: { scale: 0.95, rotate: -2 }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className={`help-icon-container relative inline-block ${className}`}>
      {/* Help Icon Button */}
      <motion.button
        ref={iconRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={`
          help-icon-button
          inline-flex items-center justify-center
          rounded-full
          text-gray-400 hover:text-blue-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-colors duration-200
          ${iconClassName}
        `}
        style={{
          width: currentSize.icon + currentSize.padding * 2,
          height: currentSize.icon + currentSize.padding * 2
        }}
        aria-label={ariaLabel || `Help information${title ? ` for ${title}` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        variants={iconVariants}
        initial="idle"
        whileHover="hover"
        whileTap="active"
        animate={isOpen ? "active" : isHovered ? "hover" : "idle"}
      >
        <HelpCircle 
          size={currentSize.icon} 
          className="transition-colors duration-200"
        />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={tooltipRef}
            className={`
              help-tooltip
              absolute z-50
              ${currentPosition.tooltip}
              ${tooltipClassName}
            `}
            style={{ maxWidth: `${maxWidth}px` }}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.2
            }}
            role="dialog"
            aria-labelledby={title ? "help-tooltip-title" : undefined}
            aria-describedby="help-tooltip-content"
          >
            {/* Tooltip Content */}
            <div className="
              bg-gray-900 text-white
              rounded-lg shadow-2xl
              border border-gray-700
              overflow-hidden
            ">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="
                  flex items-center justify-between
                  px-4 py-3
                  bg-gray-800 border-b border-gray-700
                ">
                  {title && (
                    <h3 
                      id="help-tooltip-title"
                      className="text-sm font-semibold text-white"
                    >
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={handleClose}
                      className="
                        p-1 rounded-md
                        text-gray-400 hover:text-white
                        hover:bg-gray-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition-colors duration-200
                      "
                      aria-label="Close help tooltip"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div 
                id="help-tooltip-content"
                className="px-4 py-3 text-sm leading-relaxed"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Customize markdown components for better styling
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-200">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-300">{children}</em>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="px-1 py-0.5 bg-gray-700 rounded text-xs font-mono text-blue-300">
                          {children}
                        </code>
                      ) : (
                        <code className="block p-2 bg-gray-800 rounded text-xs font-mono text-blue-300 overflow-x-auto">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="p-2 bg-gray-800 rounded text-xs font-mono text-blue-300 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="pl-3 border-l-2 border-blue-500 text-gray-300 italic">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-blue-400 hover:text-blue-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold text-white mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-semibold text-white mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-white mb-1">{children}</h3>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-600">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-white text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-2 py-1 text-gray-200">
                        {children}
                      </td>
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Arrow */}
            <div className={`
              absolute w-2 h-2 bg-gray-900 border border-gray-700
              transform rotate-45
              ${currentPosition.arrow}
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export default
export default HelpIcon;

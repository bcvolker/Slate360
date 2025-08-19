import React, { useState } from 'react';
import HelpIcon from '../components/HelpIcon';
import ProcessGuide from '../components/ProcessGuide';

// Example 1: Enhanced HelpIcon with Markdown
export function EnhancedHelpIconExample() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Enhanced HelpIcon with Markdown Support</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Help Icon */}
        <div className="space-y-3">
          <h4 className="font-medium">Basic Help Icon</h4>
          <HelpIcon
            content="This is a simple help tooltip with basic text content."
            title="Basic Help"
            size="md"
            position="top"
          />
        </div>

        {/* Help Icon with Markdown */}
        <div className="space-y-3">
          <h4 className="font-medium">Help Icon with Markdown</h4>
          <HelpIcon
            content={`
# Getting Started

Welcome to our application! Here's how to get started:

## Quick Steps
1. **Sign up** for an account
2. **Verify** your email address
3. **Complete** your profile

## Important Notes
- Make sure to use a strong password
- Keep your email address updated
- Contact support if you need help

## Code Example
\`\`\`javascript
// Example configuration
const config = {
  apiKey: 'your-api-key',
  environment: 'production'
};
\`\`\`

For more information, visit our [documentation](https://docs.example.com).
            `}
            title="Getting Started Guide"
            size="lg"
            position="right"
            maxWidth={400}
          />
        </div>

        {/* Help Icon with Different Positions */}
        <div className="space-y-3">
          <h4 className="font-medium">Different Positions</h4>
          <div className="flex space-x-2">
            <HelpIcon
              content="This tooltip appears above the icon."
              position="top"
              size="sm"
            />
            <HelpIcon
              content="This tooltip appears below the icon."
              position="bottom"
              size="sm"
            />
            <HelpIcon
              content="This tooltip appears to the left of the icon."
              position="left"
              size="sm"
            />
            <HelpIcon
              content="This tooltip appears to the right of the icon."
              position="right"
              size="sm"
            />
          </div>
        </div>

        {/* Help Icon with Auto-close */}
        <div className="space-y-3">
          <h4 className="font-medium">Auto-close Help Icon</h4>
          <HelpIcon
            content="This tooltip will automatically close after 3 seconds."
            title="Auto-close Demo"
            autoClose={true}
            autoCloseDelay={3000}
            trigger="hover"
            size="md"
          />
        </div>

        {/* Help Icon with Click Trigger Only */}
        <div className="space-y-3">
          <h4 className="font-medium">Click-Only Help Icon</h4>
          <HelpIcon
            content="This tooltip only opens when you click the icon, not on hover."
            title="Click Trigger"
            trigger="click"
            size="md"
          />
        </div>

        {/* Help Icon with Custom Styling */}
        <div className="space-y-3">
          <h4 className="font-medium">Custom Styled Help Icon</h4>
          <HelpIcon
            content="This help icon has custom styling applied."
            title="Custom Styling"
            size="lg"
            className="inline-block"
            iconClassName="text-purple-500 hover:text-purple-600"
            tooltipClassName="shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

// Example 2: Enhanced ProcessGuide with Different Variants
export function EnhancedProcessGuideExample() {
  const [currentStep, setCurrentStep] = useState(0);

  const projectSteps = [
    {
      id: 'planning',
      title: 'Project Planning',
      description: 'Define project scope, objectives, and timeline.',
      duration: '2-3 days',
      requirements: [
        'Project requirements document',
        'Stakeholder approval',
        'Resource allocation plan'
      ],
      tips: [
        'Involve all key stakeholders early',
        'Document assumptions clearly',
        'Set realistic timelines'
      ]
    },
    {
      id: 'design',
      title: 'Design Phase',
      description: 'Create detailed designs and mockups for the project.',
      duration: '1-2 weeks',
      requirements: [
        'Design software (Figma, Sketch, etc.)',
        'Brand guidelines',
        'User research data'
      ],
      tips: [
        'Start with wireframes',
        'Get feedback early and often',
        'Consider mobile-first design'
      ]
    },
    {
      id: 'development',
      title: 'Development',
      description: 'Build the project according to the approved designs.',
      duration: '3-4 weeks',
      requirements: [
        'Development environment setup',
        'Code repository access',
        'API documentation'
      ],
      tips: [
        'Follow coding standards',
        'Write tests as you go',
        'Regular code reviews'
      ]
    },
    {
      id: 'testing',
      title: 'Testing & QA',
      description: 'Thoroughly test all features and fix any issues.',
      duration: '1-2 weeks',
      requirements: [
        'Test plan',
        'Test data',
        'Bug tracking system'
      ],
      tips: [
        'Test on multiple devices',
        'Include edge cases',
        'Document all bugs found'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Deploy the project to production environment.',
      duration: '1 day',
      requirements: [
        'Production environment access',
        'Deployment scripts',
        'Rollback plan'
      ],
      tips: [
        'Deploy during low-traffic hours',
        'Monitor closely after deployment',
        'Have a rollback strategy ready'
      ]
    }
  ];

  const simpleSteps = [
    {
      id: 'step1',
      title: 'Step 1',
      description: 'This is the first step in the process.'
    },
    {
      id: 'step2',
      title: 'Step 2',
      description: 'This is the second step in the process.'
    },
    {
      id: 'step3',
      title: 'Step 3',
      description: 'This is the third step in the process.'
    }
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Enhanced ProcessGuide with Different Variants</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Default Variant */}
        <div className="space-y-4">
          <h4 className="font-medium">Default Variant (Detailed)</h4>
          <ProcessGuide
            title="Project Workflow"
            steps={projectSteps}
            variant="default"
            theme="light"
            showStepNumbers={true}
            showProgress={true}
            defaultOpen={true}
            maxHeight={500}
          />
        </div>

        {/* Compact Variant */}
        <div className="space-y-4">
          <h4 className="font-medium">Compact Variant</h4>
          <ProcessGuide
            title="Quick Process"
            steps={simpleSteps}
            variant="compact"
            theme="blue"
            showStepNumbers={true}
            showProgress={false}
            maxHeight={300}
          />
        </div>

        {/* Dark Theme */}
        <div className="space-y-4">
          <h4 className="font-medium">Dark Theme</h4>
          <ProcessGuide
            title="Dark Process Guide"
            steps={projectSteps.slice(0, 3)}
            variant="detailed"
            theme="dark"
            showStepNumbers={true}
            showProgress={true}
            maxHeight={400}
          />
        </div>

        {/* Green Theme with Auto-close */}
        <div className="space-y-4">
          <h4 className="font-medium">Green Theme with Auto-close</h4>
          <ProcessGuide
            title="Auto-close Demo"
            steps={simpleSteps}
            variant="default"
            theme="green"
            showStepNumbers={true}
            showProgress={true}
            autoClose={true}
            autoCloseDelay={5000}
            maxHeight={300}
          />
        </div>
      </div>

      {/* Interactive Process Guide */}
      <div className="space-y-4">
        <h4 className="font-medium">Interactive Process Guide</h4>
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous Step
          </button>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {projectSteps.length}
          </span>
          <button
            onClick={() => setCurrentStep(Math.min(projectSteps.length - 1, currentStep + 1))}
            disabled={currentStep === projectSteps.length - 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next Step
          </button>
        </div>
        
        <ProcessGuide
          title="Interactive Guide"
          steps={projectSteps.map((step, index) => ({
            ...step,
            status: index === currentStep ? 'active' : 
                    index < currentStep ? 'completed' : 'pending'
          }))}
          variant="detailed"
          theme="blue"
          showStepNumbers={true}
          showProgress={true}
          defaultOpen={true}
          maxHeight={400}
        />
      </div>
    </div>
  );
}

// Example 3: Combined Usage
export function CombinedUsageExample() {
  const helpContent = `
# Project Management Help

## Overview
This section helps you understand how to manage projects effectively.

## Key Concepts
- **Project Scope**: Define what will and won't be included
- **Timeline**: Set realistic deadlines and milestones
- **Resources**: Allocate team members and budget appropriately

## Best Practices
1. Start with clear objectives
2. Break down into manageable tasks
3. Regular progress reviews
4. Stakeholder communication

For more details, see our [Project Management Guide](https://example.com/guide).
  `;

  const processSteps = [
    {
      id: 'create',
      title: 'Create Project',
      description: 'Set up a new project with basic information.',
      duration: '5 minutes',
      requirements: ['Project name', 'Description', 'Start date'],
      tips: ['Use descriptive names', 'Include key details', 'Set realistic dates']
    },
    {
      id: 'plan',
      title: 'Plan Tasks',
      description: 'Break down the project into specific tasks.',
      duration: '30 minutes',
      requirements: ['Task list', 'Dependencies', 'Time estimates'],
      tips: ['Group related tasks', 'Identify critical path', 'Add buffer time']
    },
    {
      id: 'assign',
      title: 'Assign Team',
      description: 'Allocate team members to specific tasks.',
      duration: '15 minutes',
      requirements: ['Team member list', 'Skill matrix', 'Availability'],
      tips: ['Match skills to tasks', 'Consider workload', 'Plan for contingencies']
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Combined Usage Example</h3>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold textGray-900">
            Project Setup
          </h4>
          <HelpIcon
            content={helpContent}
            title="Project Management Help"
            size="lg"
            position="bottom"
            maxWidth={500}
          />
        </div>
        
        <p className="text-gray-600 mb-6">
          Follow these steps to set up your project successfully. 
          Click on any step to see detailed information and requirements.
        </p>
        
        <ProcessGuide
          title="Project Setup Process"
          steps={processSteps}
          variant="detailed"
          theme="blue"
          showStepNumbers={true}
          showProgress={true}
          defaultOpen={true}
          maxHeight={400}
        />
      </div>
    </div>
  );
}

// Main example component
export function EnhancedComponentsExamples() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Enhanced Components Examples</h2>
      
      <EnhancedHelpIconExample />
      <EnhancedProcessGuideExample />
      <CombinedUsageExample />
    </div>
  );
}

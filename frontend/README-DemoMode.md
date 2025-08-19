# Demo Mode System for Slate360

A comprehensive demo mode system that provides users with a realistic experience of the Slate360 platform using sample data, simulated operations, and interactive workflows.

## 🚀 Features

### **Demo Mode Toggle**
- **Visual Toggle**: Beautiful animated toggle button with smooth transitions
- **Mode Switching**: Seamlessly switch between live and demo modes
- **Loading States**: Simulated loading with progress indicators
- **Toast Notifications**: User feedback for mode changes

### **Sample Data**
- **5 Realistic Projects**: Commercial, residential, healthcare, energy, and infrastructure projects
- **Team Members**: Sample users with different roles and permissions
- **Files & Documents**: Various file types with realistic metadata
- **Analytics**: Comprehensive project statistics and budget overviews
- **Notifications**: Sample system notifications and alerts

### **Interactive Workflow Walkthrough**
- **7-Step Guide**: Comprehensive tour of platform features
- **Auto-play Mode**: Hands-free guided experience
- **Progress Tracking**: Visual progress indicators
- **Step Navigation**: Jump to any step or reset progress
- **Pro Tips**: Contextual hints for each step

### **Simulated Operations**
- **File Uploads**: Realistic upload progress and processing
- **Project Creation**: Simulated project setup workflows
- **Data Synchronization**: Mock sync operations with progress
- **Team Management**: Simulated collaboration features

## 📁 File Structure

```
src/
├── components/
│   ├── DemoModeToggle.tsx          # Main toggle component
│   ├── DemoBanner.tsx              # Demo status banner
│   └── DemoWorkflowWalkthrough.tsx # Interactive workflow guide
├── contexts/
│   └── DemoContext.tsx             # Demo state management
├── lib/
│   └── demo/
│       └── demoData.ts             # Sample data and simulation functions
└── examples/
    └── DemoModeExamples.tsx        # Comprehensive showcase page
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install framer-motion lucide-react react-hot-toast
```

### 2. Wrap Your App with DemoProvider
```tsx
// app/layout.tsx or _app.tsx
import { DemoProvider } from '../contexts/DemoContext';

export default function RootLayout({ children }) {
  return (
    <DemoProvider>
      {children}
    </DemoProvider>
  );
}
```

### 3. Add Demo Banner to Your Layout
```tsx
// components/Layout.tsx
import { DemoBanner } from './DemoBanner';

export function Layout({ children }) {
  return (
    <div>
      <DemoBanner />
      {children}
    </div>
  );
}
```

### 4. Use Demo Mode Toggle
```tsx
// components/Header.tsx
import { DemoModeToggle } from './DemoModeToggle';
import { useDemo } from '../contexts/DemoContext';

export function Header() {
  const { isDemoMode, toggleDemoMode } = useDemo();
  
  return (
    <header>
      <DemoModeToggle
        isDemoMode={isDemoMode}
        onToggle={toggleDemoMode}
      />
    </header>
  );
}
```

## 🎯 Usage Examples

### Basic Demo Mode Toggle
```tsx
import { DemoModeToggle } from '../components/DemoModeToggle';

function MyComponent() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  return (
    <DemoModeToggle
      isDemoMode={isDemoMode}
      onToggle={setIsDemoMode}
      className="my-4"
    />
  );
}
```

### Accessing Demo Data
```tsx
import { useDemo } from '../contexts/DemoContext';

function ProjectList() {
  const { 
    isDemoMode, 
    projects, 
    createDemoProject,
    updateDemoProject,
    deleteDemoProject 
  } = useDemo();
  
  if (isDemoMode) {
    // Use demo data and operations
    return (
      <div>
        {projects.map(project => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    );
  }
  
  // Use real data
  return <RealProjectList />;
}
```

### Starting Workflow Walkthrough
```tsx
import { useDemo } from '../contexts/DemoContext';
import { DemoWorkflowWalkthrough } from '../components/DemoWorkflowWalkthrough';

function Dashboard() {
  const { startWorkflow, completeWorkflowStep } = useDemo();
  const [showWorkflow, setShowWorkflow] = useState(false);
  
  const handleStartTour = () => {
    startWorkflow();
    setShowWorkflow(true);
  };
  
  return (
    <div>
      <button onClick={handleStartTour}>
        Start Demo Tour
      </button>
      
      <DemoWorkflowWalkthrough
        isOpen={showWorkflow}
        onClose={() => setShowWorkflow(false)}
        onStepComplete={completeWorkflowStep}
      />
    </div>
  );
}
```

## 🔧 Customization

### Customizing Demo Data
```tsx
// lib/demo/demoData.ts
export const demoProjects: IProject[] = [
  {
    _id: 'custom_proj_001',
    name: 'Your Custom Project',
    description: 'Custom project description',
    status: 'planning',
    // ... other properties
  }
];
```

### Adding New Demo Operations
```tsx
// contexts/DemoContext.tsx
const customDemoOperation = async (data: any) => {
  try {
    // Simulate operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success
    return { success: true, data: 'Custom result' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add to context value
const contextValue = {
  // ... existing values
  customDemoOperation
};
```

### Customizing Workflow Steps
```tsx
// lib/demo/demoData.ts
export const demoWorkflowSteps = [
  {
    id: 'custom_step',
    title: 'Custom Step Title',
    description: 'Custom step description',
    duration: '5 minutes',
    completed: false
  }
  // ... other steps
];
```

## 🎨 Styling & Theming

### Custom CSS Classes
```tsx
<DemoModeToggle
  className="custom-toggle"
  iconClassName="custom-icon"
  tooltipClassName="custom-tooltip"
/>
```

### Tailwind CSS Customization
```css
/* globals.css */
.demo-mode-active {
  @apply bg-gradient-to-r from-purple-500 to-pink-500;
}

.demo-banner {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
}
```

## 📱 Responsive Design

The demo mode components are fully responsive and work on all device sizes:

- **Mobile**: Stacked layouts with touch-friendly buttons
- **Tablet**: Optimized grid layouts
- **Desktop**: Full-featured interfaces with hover effects

## ♿ Accessibility Features

- **ARIA Labels**: Proper screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG compliant color schemes
- **Screen Reader**: Descriptive text for all interactive elements

## 🧪 Testing

### Unit Tests
```tsx
// __tests__/DemoModeToggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DemoModeToggle } from '../DemoModeToggle';

test('toggles demo mode when clicked', () => {
  const mockToggle = jest.fn();
  render(
    <DemoModeToggle
      isDemoMode={false}
      onToggle={mockToggle}
    />
  );
  
  fireEvent.click(screen.getByText('Live Mode'));
  expect(mockToggle).toHaveBeenCalledWith(true);
});
```

### Integration Tests
```tsx
// __tests__/DemoContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useDemo, DemoProvider } from '../DemoContext';

test('provides demo data when demo mode is active', () => {
  const wrapper = ({ children }) => (
    <DemoProvider>{children}</DemoProvider>
  );
  
  const { result } = renderHook(() => useDemo(), { wrapper });
  
  act(() => {
    result.current.toggleDemoMode();
  });
  
  expect(result.current.isDemoMode).toBe(true);
  expect(result.current.projects).toHaveLength(5);
});
```

## 🚀 Performance Considerations

### Lazy Loading
```tsx
// Lazy load demo components
const DemoWorkflowWalkthrough = lazy(() => import('./DemoWorkflowWalkthrough'));

// Only load when needed
{showWorkflow && (
  <Suspense fallback={<div>Loading...</div>}>
    <DemoWorkflowWalkthrough />
  </Suspense>
)}
```

### Memory Management
```tsx
// Clean up demo data when switching modes
useEffect(() => {
  if (!isDemoMode) {
    // Clear demo data from memory
    setProjects([]);
    setWorkflowProgress(0);
  }
}, [isDemoMode]);
```

## 🔒 Security Considerations

- **Demo Data Only**: All demo operations are simulated
- **No Real API Calls**: Demo mode never makes actual API requests
- **Isolated State**: Demo data is completely separate from production data
- **User Consent**: Users explicitly choose to enter demo mode

## 📊 Analytics & Tracking

### Demo Mode Usage
```tsx
// Track demo mode usage
const trackDemoModeUsage = (action: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'demo_mode_action', {
      action,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Workflow Completion
```tsx
// Track workflow progress
const handleStepComplete = (stepId: string) => {
  completeWorkflowStep(stepId);
  
  // Analytics tracking
  trackDemoModeUsage(`workflow_step_completed_${stepId}`);
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Demo Mode Not Working**
   - Ensure `DemoProvider` wraps your app
   - Check that all dependencies are installed
   - Verify context is properly imported

2. **Sample Data Not Loading**
   - Check browser console for errors
   - Verify demo data files are properly imported
   - Ensure demo mode is actually enabled

3. **Workflow Not Starting**
   - Check if `startWorkflow` function is called
   - Verify modal state management
   - Check for conflicting state updates

### Debug Mode
```tsx
// Enable debug logging
const DEBUG_DEMO = process.env.NODE_ENV === 'development';

if (DEBUG_DEMO) {
  console.log('Demo mode state:', isDemoMode);
  console.log('Demo projects:', projects);
  console.log('Workflow progress:', workflowProgress);
}
```

## 🤝 Contributing

### Adding New Features
1. Create new component in `components/` directory
2. Add to demo context if needed
3. Update demo data with new sample content
4. Add to workflow steps if applicable
5. Update documentation

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper JSDoc comments
- Include accessibility features
- Write unit tests for new functionality

## 📚 Additional Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

This demo mode system is part of the Slate360 project and follows the same licensing terms.

---

**Happy Demo-ing! 🎉**

For questions or support, please refer to the main project documentation or create an issue in the repository.

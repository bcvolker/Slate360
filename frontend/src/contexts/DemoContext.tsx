import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import {
  demoProjects,
  demoUsers,
  demoFiles,
  demoNotifications,
  demoAnalytics,
  simulateFileUpload,
  simulateProjectCreation,
  simulateDataSync,
  getDemoProject,
  getDemoProjectsByStatus,
  getDemoProjectsByType,
  searchDemoProjects,
  getDemoUser,
  getDemoFilesByProject,
  getDemoNotifications
} from '../lib/demo/demoData';
import { IProject } from '../models/Project';

interface DemoContextType {
  // Demo mode state
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  
  // Demo data
  projects: any[];
  users: any[];
  files: any[];
  notifications: any[];
  analytics: any;
  
  // Demo operations
  createDemoProject: (projectData: Partial<IProject>) => Promise<{ success: boolean; projectId?: string; error?: string }>;
  updateDemoProject: (id: string, updates: Partial<IProject>) => Promise<{ success: boolean; error?: string }>;
  deleteDemoProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  uploadDemoFile: (file: File, projectId: string, onProgress?: (progress: number) => void) => Promise<{ success: boolean; fileId?: string; error?: string }>;
  syncDemoData: () => Promise<{ success: boolean; syncedItems: number }>;
  
  // Demo queries
  getProject: (id: string) => Partial<IProject> | undefined;
  getProjectsByStatus: (status: string) => Partial<IProject>[];
  getProjectsByType: (type: string) => Partial<IProject>[];
  searchProjects: (query: string) => Partial<IProject>[];
  getUser: (id: string) => any;
  getFilesByProject: (projectId: string) => any[];
  getNotifications: (limit?: number) => any[];
  
  // Demo workflow
  startWorkflow: () => void;
  completeWorkflowStep: (stepId: string) => void;
  workflowProgress: number;
  
  // Demo indicators
  showDemoBanner: boolean;
  hideDemoBanner: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  // Initialize demo data when demo mode is enabled
  useEffect(() => {
    if (isDemoMode) {
      setProjects([...demoProjects]);
      setShowDemoBanner(true);
      
      // Show welcome message
      toast.success('🎉 Welcome to Demo Mode! Explore sample projects and features.', {
        duration: 5000,
        icon: '🚀'
      });
    } else {
      setProjects([]);
      setShowDemoBanner(false);
      setWorkflowProgress(0);
    }
  }, [isDemoMode]);

  // Toggle demo mode
  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  // Demo project operations
  const createDemoProject = async (projectData: Partial<IProject>) => {
    try {
      toast.loading('Creating demo project...', { id: 'demo-project-create' });
      
      const result = await simulateProjectCreation(projectData);
      
      if (result.success && result.projectId) {
        const newProject = {
          _id: result.projectId,
          name: projectData.name || 'New Demo Project',
          description: projectData.description || 'A demo project created for testing purposes.',
          status: 'planning',
          type: 'other',
          location: {
            address: 'Demo Address',
            city: 'Demo City',
            state: 'DS',
            zipCode: '00000',
            country: 'USA',
            coordinates: { lat: 0, lng: 0 }
          },
          client: {
            name: 'Demo Client',
            company: 'Demo Company',
            email: 'demo@example.com',
            phone: '+1-555-0000'
          },
          timeline: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            milestones: []
          },
          budget: {
            estimated: 100000,
            actual: 0,
            currency: 'USD',
            breakdown: {
              materials: 50000,
              labor: 30000,
              equipment: 10000,
              permits: 5000,
              contingency: 5000
            }
          },
          team: [],
          tags: ['demo', 'new'],
          createdBy: 'demo_user_001' as any,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any as IProject;

        setProjects(prev => [newProject, ...prev]);
        
        toast.success('Demo project created successfully!', { id: 'demo-project-create' });
        
        return { success: true, projectId: result.projectId };
      } else {
        throw new Error(result.error || 'Failed to create project');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create demo project: ${errorMessage}`, { id: 'demo-project-create' });
      return { success: false, error: errorMessage };
    }
  };

  const updateDemoProject = async (id: string, updates: Partial<IProject>) => {
    try {
      setProjects(prev => 
        prev.map(project => 
          project._id === id 
            ? { ...project, ...updates, updatedAt: new Date() }
            : project
        )
      );
      
      toast.success('Demo project updated successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update demo project: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  const deleteDemoProject = async (id: string) => {
    try {
      setProjects(prev => prev.filter(project => project._id !== id));
      toast.success('Demo project deleted successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete demo project: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  // Demo file operations
  const uploadDemoFile = async (
    file: File, 
    projectId: string, 
    onProgress?: (progress: number) => void
  ) => {
    try {
      toast.loading('Uploading demo file...', { id: 'demo-file-upload' });
      
      const result = await simulateFileUpload(file, projectId, onProgress);
      
      if (result.success) {
        toast.success('Demo file uploaded successfully!', { id: 'demo-file-upload' });
        return result;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to upload demo file: ${errorMessage}`, { id: 'demo-file-upload' });
      return { success: false, error: errorMessage };
    }
  };

  // Demo data sync
  const syncDemoData = async () => {
    try {
      toast.loading('Syncing demo data...', { id: 'demo-sync' });
      
      const result = await simulateDataSync();
      
      if (result.success) {
        toast.success(`Demo data synced! ${result.syncedItems} items processed.`, { id: 'demo-sync' });
        return result;
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to sync demo data: ${errorMessage}`, { id: 'demo-sync' });
      return { success: false, syncedItems: 0 };
    }
  };

  // Demo workflow management
  const startWorkflow = () => {
    setWorkflowProgress(0);
    toast.success('🚀 Demo workflow started! Follow the guided tour.', {
      duration: 4000
    });
  };

  const completeWorkflowStep = (stepId: string) => {
    setWorkflowProgress(prev => {
      const newProgress = Math.min(prev + (100 / 7), 100); // 7 total steps
      
      if (newProgress >= 100) {
        toast.success('🎉 Demo workflow completed! You\'ve explored all the key features.', {
          duration: 6000
        });
      }
      
      return newProgress;
    });
  };

  // Hide demo banner
  const hideDemoBanner = () => {
    setShowDemoBanner(false);
  };

  // Context value
  const contextValue: DemoContextType = {
    // Demo mode state
    isDemoMode,
    toggleDemoMode,
    
    // Demo data
    projects,
    users: demoUsers,
    files: demoFiles,
    notifications: demoNotifications,
    analytics: demoAnalytics,
    
    // Demo operations
    createDemoProject,
    updateDemoProject,
    deleteDemoProject,
    uploadDemoFile,
    syncDemoData,
    
    // Demo queries
    getProject: getDemoProject,
    getProjectsByStatus: getDemoProjectsByStatus,
    getProjectsByType: getDemoProjectsByType,
    searchProjects: searchDemoProjects,
    getUser: getDemoUser,
    getFilesByProject: getDemoFilesByProject,
    getNotifications: getDemoNotifications,
    
    // Demo workflow
    startWorkflow,
    completeWorkflowStep,
    workflowProgress,
    
    // Demo indicators
    showDemoBanner,
    hideDemoBanner
  };

  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
}

// Custom hook to use demo context
export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}

export default DemoProvider;

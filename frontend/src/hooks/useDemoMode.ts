import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface DemoData {
  projectCount: number;
  userCount: number;
  isLoaded: boolean;
  lastUpdated: Date | null;
}

export interface UseDemoModeReturn {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoData: DemoData;
  loadDemoData: () => Promise<void>;
  clearDemoData: () => void;
  isLoading: boolean;
}

const DEMO_MODE_KEY = 'slate360_demo_mode';
const DEMO_DATA_KEY = 'slate360_demo_data';

export function useDemoMode(): UseDemoModeReturn {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoData, setDemoData] = useState<DemoData>({
    projectCount: 0,
    userCount: 0,
    isLoaded: false,
    lastUpdated: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load demo mode state from localStorage on mount
  useEffect(() => {
    const savedDemoMode = localStorage.getItem(DEMO_MODE_KEY);
    if (savedDemoMode === 'true') {
      setIsDemoMode(true);
      loadSavedDemoData();
    }
  }, []);

  // Load saved demo data from localStorage
  const loadSavedDemoData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(DEMO_DATA_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setDemoData({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : null
        });
      }
    } catch (error) {
      console.error('Failed to load saved demo data:', error);
    }
  }, []);

  // Save demo mode state to localStorage
  const saveDemoModeState = useCallback((enabled: boolean) => {
    localStorage.setItem(DEMO_MODE_KEY, enabled.toString());
  }, []);

  // Save demo data to localStorage
  const saveDemoData = useCallback((data: DemoData) => {
    try {
      localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save demo data:', error);
    }
  }, []);

  // Load demo data (simulate API call)
  const loadDemoData = useCallback(async () => {
    if (!isDemoMode) return;

    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate sample demo data
      const newDemoData: DemoData = {
        projectCount: Math.floor(Math.random() * 15) + 5, // 5-20 projects
        userCount: Math.floor(Math.random() * 8) + 3, // 3-11 users
        isLoaded: true,
        lastUpdated: new Date()
      };

      setDemoData(newDemoData);
      saveDemoData(newDemoData);

      toast.success(`Demo mode activated! Loaded ${newDemoData.projectCount} sample projects.`);
      
    } catch (error) {
      console.error('Failed to load demo data:', error);
      toast.error('Failed to load demo data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode, saveDemoData]);

  // Clear demo data
  const clearDemoData = useCallback(() => {
    setDemoData({
      projectCount: 0,
      userCount: 0,
      isLoaded: false,
      lastUpdated: null
    });
    localStorage.removeItem(DEMO_DATA_KEY);
  }, []);

  // Toggle demo mode
  const toggleDemoMode = useCallback(async () => {
    const newMode = !isDemoMode;
    
    if (newMode) {
      // Enabling demo mode
      setIsDemoMode(true);
      saveDemoModeState(true);
      await loadDemoData();
    } else {
      // Disabling demo mode
      setIsDemoMode(false);
      saveDemoModeState(false);
      clearDemoData();
      toast.success('Demo mode disabled. Switched to live mode.');
    }
  }, [isDemoMode, saveDemoModeState, loadDemoData, clearDemoData]);

  // Auto-load demo data when demo mode is enabled
  useEffect(() => {
    if (isDemoMode && !demoData.isLoaded) {
      loadDemoData();
    }
  }, [isDemoMode, demoData.isLoaded, loadDemoData]);

  return {
    isDemoMode,
    toggleDemoMode,
    demoData,
    loadDemoData,
    clearDemoData,
    isLoading
  };
}

export default useDemoMode;

import { UnifiedProject } from '@/types/project';

// Helper function to create valid ObjectId from a seed string
const createObjectId = (seed: string) => {
  // Create a deterministic ObjectId based on the seed string
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Convert to a valid 24-character hex string
  const hexString = Math.abs(hash).toString(16).padStart(24, '0');
  return hexString;
};

// Demo project data - using the UnifiedProject type
export const demoProjects: UnifiedProject[] = [
  {
    _id: 'demo_proj_001',
    name: 'Modern Office Complex',
    description: 'A state-of-the-art office building featuring sustainable design, smart building technology, and collaborative workspaces.',
    type: 'commercial',
    status: 'active',
    location: {
      address: '123 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    client: {
      name: 'TechCorp Industries',
      email: 'projects@techcorp.com',
      phone: '+1-555-0101',
      company: 'TechCorp Industries'
    },
    timeline: {
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-12-31'),
      estimatedDuration: 365
    },
    budget: {
      estimated: 25000000,
      actual: 8500000,
      currency: 'USD'
    },
    team: [
      { 
        userId: 'demo_user_001',
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      },
      { 
        userId: 'demo_user_002',
        role: 'architect',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['commercial', 'sustainable', 'smart-building', 'office'],
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-15')
  },
  {
    _id: 'demo_proj_002',
    name: 'Residential Community',
    description: 'A mixed-use residential development featuring luxury apartments, townhouses, and community amenities.',
    type: 'residential',
    status: 'planning',
    location: {
      address: '456 Green Meadows Lane',
      city: 'Suburbia',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    client: {
      name: 'Urban Living Group',
      email: 'info@urbanliving.com',
      phone: '+1-555-0456',
      company: 'Urban Living Group'
    },
    timeline: {
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      estimatedDuration: 365
    },
    budget: {
      estimated: 4500000,
      currency: 'USD'
    },
    team: [
      { 
        userId: 'demo_user_005',
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['residential', 'mixed-use', 'luxury', 'community'],
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-06-10')
  },
  {
    _id: 'demo_proj_003',
    name: 'Hospital Renovation',
    description: 'Comprehensive renovation of the emergency department and patient care facilities.',
    type: 'renovation',
    status: 'completed',
    location: {
      address: '789 Medical Center Blvd',
      city: 'Healthville',
      state: 'TX',
      zipCode: '75001',
      country: 'USA',
      coordinates: { lat: 32.7767, lng: -96.7970 }
    },
    client: {
      name: 'City General Hospital',
      email: 'facilities@citygeneral.org',
      phone: '+1-555-0789',
      company: 'City General Hospital'
    },
    timeline: {
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      estimatedDuration: 365
    },
    budget: {
      estimated: 1800000,
      actual: 1750000,
      currency: 'USD'
    },
    team: [
      { 
        userId: 'demo_user_007',
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['healthcare', 'renovation', 'emergency', 'patient-care'],
    createdBy: 'demo_user_001',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-06-01')
  }
];

// Demo user data
export const demoUsers = [
  {
    id: 'demo_user_001',
    name: 'Alex Johnson',
    email: 'alex.johnson@slate360.com',
    role: 'project_manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    lastActive: new Date('2024-06-15T10:30:00Z'),
    permissions: ['read', 'write', 'admin']
  },
  {
    id: 'demo_user_002',
    name: 'Sarah Chen',
    email: 'sarah.chen@slate360.com',
    role: 'architect',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    lastActive: new Date('2024-06-15T09:15:00Z'),
    permissions: ['read', 'write']
  },
  {
    id: 'demo_user_003',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@slate360.com',
    role: 'engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastActive: new Date('2024-06-15T08:45:00Z'),
    permissions: ['read', 'write']
  }
];

// Demo file data
export const demoFiles = [
  {
    id: 'demo_file_001',
    projectId: 'demo_proj_001',
    name: 'Architectural Plans.pdf',
    type: 'document',
    size: 2048576,
    uploadedBy: 'demo_user_002',
    uploadedAt: new Date('2024-06-10T14:30:00Z'),
    url: '/demo/files/architectural-plans.pdf'
  },
  {
    id: 'demo_file_002',
    projectId: 'demo_proj_001',
    name: '3D Model.glb',
    type: 'model',
    size: 15728640,
    uploadedBy: 'demo_user_002',
    uploadedAt: new Date('2024-06-12T16:20:00Z'),
    url: '/demo/files/3d-model.glb'
  }
];

// Demo notifications
export const demoNotifications = [
  {
    id: 'demo_notif_001',
    type: 'project_update',
    title: 'Project Status Updated',
    message: 'Modern Office Complex status changed to Active',
    timestamp: new Date('2024-06-15T10:30:00Z'),
    read: false,
    projectId: 'demo_proj_001'
  },
  {
    id: 'demo_notif_002',
    type: 'file_upload',
    title: 'New File Uploaded',
    message: 'Sarah Chen uploaded Architectural Plans.pdf',
    timestamp: new Date('2024-06-15T09:15:00Z'),
    read: true,
    projectId: 'demo_proj_001'
  }
];

// Demo analytics data
export const demoAnalytics = {
  totalProjects: 3,
  activeProjects: 1,
  completedProjects: 1,
  totalBudget: 31300000,
  totalSpent: 10250000,
  teamMembers: 3,
  filesUploaded: 2,
  lastSync: new Date('2024-06-15T10:30:00Z')
};

// Simulate file upload
export const simulateFileUpload = async (
  file: File, 
  projectId: string, 
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; fileId?: string; error?: string }> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (onProgress) onProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ 
          success: true, 
          fileId: `demo_file_${Date.now()}` 
        });
      }
    }, 200);
  });
};

// Simulate project creation
export const simulateProjectCreation = async (
  projectData: Partial<UnifiedProject>
): Promise<{ success: boolean; projectId?: string; error?: string }> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      const projectId = `demo_proj_${Date.now()}`;
      resolve({ success: true, projectId });
    }, 1500);
  });
};

// Simulate data sync
export const simulateDataSync = async (): Promise<{ success: boolean; syncedItems: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const syncedItems = Math.floor(Math.random() * 10) + 5;
      resolve({ success: true, syncedItems });
    }, 2000);
  });
};

// Get demo project by ID
export const getDemoProject = (id: string): UnifiedProject | undefined => {
  return demoProjects.find(project => project._id === id);
};

// Get demo projects by status
export const getDemoProjectsByStatus = (status: string): UnifiedProject[] => {
  return demoProjects.filter(project => project.status === status);
};

// Get demo projects by type
export const getDemoProjectsByType = (type: string): UnifiedProject[] => {
  return demoProjects.filter(project => project.type === type);
};

// Search demo projects
export const searchDemoProjects = (query: string, limit?: number): UnifiedProject[] => {
  const lowerQuery = query.toLowerCase();
  const filtered = demoProjects.filter(project => 
    project.name.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery) ||
    project.client?.name?.toLowerCase().includes(lowerQuery) ||
    project.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
  
  const sorted = filtered.sort((a, b) => 
    (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())
  );
  
  return limit ? sorted.slice(0, limit) : sorted;
};

// Get demo user by ID
export const getDemoUser = (id: string) => {
  return demoUsers.find(user => user.id === id);
};

// Get demo files by project
export const getDemoFilesByProject = (projectId: string) => {
  return demoFiles.filter(file => file.projectId === projectId);
};

// Get demo notifications
export const getDemoNotifications = (limit?: number) => {
  const sorted = demoNotifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
};

// Demo workflow steps
export const demoWorkflowSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Slate360',
    description: 'Let\'s explore the key features of your project management platform.',
    icon: '🚀',
    duration: 3000
  },
  {
    id: 'projects',
    title: 'Project Management',
    description: 'Create, organize, and track your construction projects.',
    icon: '🏗️',
    duration: 4000
  },
  {
    id: 'team',
    title: 'Team Collaboration',
    description: 'Invite team members and assign roles for better collaboration.',
    icon: '👥',
    duration: 3500
  },
  {
    id: 'files',
    title: 'File Management',
    description: 'Upload and organize project documents, models, and images.',
    icon: '📁',
    duration: 3000
  },
  {
    id: 'analytics',
    title: 'Project Analytics',
    description: 'Track progress, budget, and performance metrics.',
    icon: '📊',
    duration: 4000
  },
  {
    id: 'sync',
    title: 'Data Synchronization',
    description: 'Keep your data synchronized across all devices.',
    icon: '🔄',
    duration: 3000
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'ve explored all the key features. Start managing your projects!',
    icon: '🎉',
    duration: 5000
  }
];
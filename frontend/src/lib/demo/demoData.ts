import mongoose from 'mongoose';
import { IProject } from '../../models/Project';

// Helper function to create valid ObjectId from a seed string
const createObjectId = (seed: string) => {
  // Create a deterministic ObjectId based on the seed string
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Convert to a valid 24-character hex string
  const hexString = Math.abs(hash).toString(16).padStart(24, '0');
  return new mongoose.Types.ObjectId(hexString);
};

// Demo project data - using Partial<IProject> to allow for demo data flexibility
export const demoProjects: Partial<IProject>[] = [
  {
    _id: createObjectId('demo_proj_001'),
    name: 'Modern Office Complex',
    description: 'A state-of-the-art office building featuring sustainable design, smart building technology, and collaborative workspaces.',
    status: 'active',
    type: 'commercial',
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
      phone: '+1-555-0101'
    },
    timeline: {
      startDate: new Date('2024-01-10'),
      estimatedDuration: 365
    },
    budget: {
      estimated: 25000000,
      actual: 8500000,
      currency: 'USD'
    },
    team: [
      { 
        userId: createObjectId('demo_user_001'),
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      },
      { 
        userId: createObjectId('demo_user_002'),
        role: 'architect',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
        isActive: true
      },
      { 
        userId: createObjectId('demo_user_003'),
        role: 'engineer',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
        isActive: true
      },
      { 
        userId: createObjectId('demo_user_004'),
        role: 'contractor',
        permissions: ['read'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['commercial', 'sustainable', 'smart-building', 'office'],
    createdBy: createObjectId('demo_user_001'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-15')
  },
  {
    _id: createObjectId('demo_proj_002'),
    name: 'Residential Community',
    description: 'A mixed-use residential development featuring luxury apartments, townhouses, and community amenities.',
    status: 'planning',
    type: 'residential',
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
      phone: '+1-555-0456'
    },
    timeline: {
      startDate: new Date('2024-08-01'),
      estimatedDuration: 670
    },
    budget: {
      estimated: 4500000,
      currency: 'USD'
    },
    team: [
      { 
        userId: createObjectId('demo_user_005'),
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      },
      { 
        userId: createObjectId('demo_user_006'),
        role: 'architect',
        permissions: ['read', 'write'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['residential', 'mixed-use', 'luxury', 'community'],
    createdBy: createObjectId('demo_user_001'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-06-10')
  },
  {
    _id: createObjectId('demo_proj_003'),
    name: 'Hospital Renovation',
    description: 'Comprehensive renovation of the emergency department and patient care facilities.',
    status: 'completed',
    type: 'renovation',
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
      phone: '+1-555-0789'
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
        userId: createObjectId('demo_user_007'),
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['healthcare', 'renovation', 'emergency', 'patient-care'],
    createdBy: createObjectId('demo_user_001'),
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-06-01')
  },
  {
    _id: createObjectId('demo_proj_004'),
    name: 'Solar Farm Installation',
    description: 'Large-scale solar energy farm with battery storage and grid integration.',
    status: 'active',
    type: 'industrial',
    location: {
      address: 'Solar Valley Ranch',
      city: 'Desert Springs',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
      coordinates: { lat: 33.4484, lng: -112.0740 }
    },
    client: {
      name: 'Green Energy Solutions',
      email: 'projects@greenenergy.com',
      phone: '+1-555-0321'
    },
    timeline: {
      startDate: new Date('2024-02-01'),
      estimatedDuration: 300
    },
    budget: {
      estimated: 3200000,
      actual: 1200000,
      currency: 'USD'
    },
    team: [
      { 
        userId: createObjectId('demo_user_008'),
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['energy', 'solar', 'renewable', 'sustainability'],
    createdBy: createObjectId('demo_user_001'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-06-12')
  },
  {
    _id: createObjectId('demo_proj_005'),
    name: 'Bridge Rehabilitation',
    description: 'Structural rehabilitation and seismic retrofit of the historic downtown bridge.',
    status: 'planning',
    type: 'infrastructure',
    location: {
      address: 'Historic Bridge Crossing',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501',
      country: 'USA',
      coordinates: { lat: 33.9533, lng: -117.3962 }
    },
    client: {
      name: 'City of Riverside',
      email: 'engineering@riverside.gov',
      phone: '+1-555-0654'
    },
    timeline: {
      startDate: new Date('2025-01-01'),
      estimatedDuration: 730
    },
    budget: {
      estimated: 8500000,
      currency: 'USD'
    },
    team: [
      { 
        userId: createObjectId('demo_user_009'),
        role: 'project_manager',
        permissions: ['read', 'write', 'admin'],
        joinedAt: new Date(),
        isActive: true
      }
    ],
    tags: ['infrastructure', 'bridge', 'rehabilitation', 'seismic'],
    createdBy: createObjectId('demo_user_001'),
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-06-08')
  }
];

// Demo user data
export const demoUsers = [
  {
    id: 'demo_user_001',
    name: 'Demo User',
    email: 'demo@slate360.com',
    role: 'manager',
    tier: 'premium',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'demo_user_002',
    name: 'Sarah Johnson',
    email: 'sarah.j@demo.com',
    role: 'admin',
    tier: 'enterprise',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'demo_user_003',
    name: 'Mike Chen',
    email: 'mike.c@demo.com',
    role: 'user',
    tier: 'premium',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Demo workflow steps
export const demoWorkflowSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Slate360!',
    description: 'Let\'s walk through the key features of our project management platform.',
    duration: '2 minutes',
    completed: false
  },
  {
    id: 'explore_projects',
    title: 'Explore Sample Projects',
    description: 'Browse through our demo projects to see different types and statuses.',
    duration: '3 minutes',
    completed: false
  },
  {
    id: 'create_project',
    title: 'Create a New Project',
    description: 'Learn how to set up a new project with all the necessary details.',
    duration: '5 minutes',
    completed: false
  },
  {
    id: 'upload_files',
    title: 'Upload and Manage Files',
    description: 'Experience our file management system with sample documents.',
    duration: '4 minutes',
    completed: false
  },
  {
    id: 'team_collaboration',
    title: 'Team Collaboration',
    description: 'See how team members can collaborate on projects.',
    duration: '3 minutes',
    completed: false
  },
  {
    id: 'tracking_progress',
    title: 'Track Progress and Milestones',
    description: 'Learn about our progress tracking and milestone management.',
    duration: '4 minutes',
    completed: false
  },
  {
    id: 'reports_analytics',
    title: 'Reports and Analytics',
    description: 'Explore our reporting and analytics capabilities.',
    duration: '3 minutes',
    completed: false
  }
];

// Simulated file uploads
export const demoFiles = [
  {
    id: 'demo_file_001',
    name: 'Project_Blueprint_v2.pdf',
    size: 2457600, // 2.4MB
    type: 'application/pdf',
    uploadedAt: new Date('2024-06-10T10:30:00Z'),
    uploadedBy: 'demo_user_001',
    projectId: 'demo_proj_001',
    category: 'design',
    status: 'uploaded'
  },
  {
    id: 'demo_file_002',
    name: 'Site_Photos.zip',
    size: 15728640, // 15MB
    type: 'application/zip',
    uploadedAt: new Date('2024-06-12T14:15:00Z'),
    uploadedBy: 'demo_user_002',
    projectId: 'demo_proj_001',
    category: 'documentation',
    status: 'uploaded'
  },
  {
    id: 'demo_file_003',
    name: 'Budget_Spreadsheet.xlsx',
    size: 512000, // 512KB
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedAt: new Date('2024-06-08T09:45:00Z'),
    uploadedBy: 'demo_user_001',
    projectId: 'demo_proj_001',
    category: 'financial',
    status: 'uploaded'
  },
  {
    id: 'demo_file_004',
    name: '3D_Model.fbx',
    size: 52428800, // 50MB
    type: 'application/octet-stream',
    uploadedAt: new Date('2024-06-11T16:20:00Z'),
    uploadedBy: 'demo_user_003',
    projectId: 'demo_proj_002',
    category: 'design',
    status: 'processing'
  }
];

// Demo notifications
export const demoNotifications = [
  {
    id: 'demo_notif_001',
    title: 'Project Milestone Reached',
    message: 'Foundation work completed for Modern Office Complex project.',
    type: 'success',
    timestamp: new Date('2024-06-15T08:00:00Z'),
    read: false,
    projectId: 'demo_proj_001'
  },
  {
    id: 'demo_notif_002',
    title: 'New Team Member Added',
    message: 'David Kim has been assigned to Modern Office Complex project.',
    type: 'info',
    timestamp: new Date('2024-06-14T14:30:00Z'),
    read: false,
    projectId: 'demo_proj_001'
  },
  {
    id: 'demo_notif_003',
    title: 'Budget Update Required',
    message: 'Please review and update budget for Residential Community project.',
    type: 'warning',
    timestamp: new Date('2024-06-13T11:15:00Z'),
    read: true,
    projectId: 'demo_proj_002'
  }
];

// Demo analytics data
export const demoAnalytics = {
  projectStats: {
    total: 5,
    inProgress: 2,
    completed: 1,
    planning: 2,
    onTime: 3,
    delayed: 1,
    underBudget: 2,
    overBudget: 1
  },
  budgetOverview: {
    totalBudget: 20000000,
    totalSpent: 3950000,
    totalRemaining: 16050000,
    averageCompletion: 19.75
  },
  teamPerformance: {
    activeMembers: 12,
    totalHours: 2840,
    averageEfficiency: 87.5,
    topPerformer: 'Sarah Johnson'
  },
  recentActivity: [
    { action: 'Project created', project: 'Bridge Rehabilitation', user: 'Demo User', time: '2 hours ago' },
    { action: 'File uploaded', project: 'Modern Office Complex', user: 'Mike Chen', time: '4 hours ago' },
    { action: 'Milestone completed', project: 'Hospital Renovation', user: 'Dr. Maria Garcia', time: '1 day ago' },
    { action: 'Budget updated', project: 'Solar Farm Installation', user: 'Tom Martinez', time: '2 days ago' }
  ]
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
      progress += Math.random() * 15 + 5; // Random progress increment
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate processing time
        setTimeout(() => {
          const fileId = `demo_file_${Date.now()}`;
          resolve({ success: true, fileId });
        }, 1000);
      }
      
      if (onProgress) {
        onProgress(Math.min(progress, 100));
      }
    }, 200);
  });
};

// Simulate project creation
export const simulateProjectCreation = async (
  projectData: Partial<IProject>
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
export const getDemoProject = (id: string): Partial<IProject> | undefined => {
  return demoProjects.find(project => project._id?.toString() === id);
};

// Get demo projects by status
export const getDemoProjectsByStatus = (status: string): Partial<IProject>[] => {
  return demoProjects.filter(project => project.status === status);
};

// Get demo projects by type
export const getDemoProjectsByType = (type: string): Partial<IProject>[] => {
  return demoProjects.filter(project => project.type === type);
};

// Search demo projects
export const searchDemoProjects = (query: string, limit?: number): Partial<IProject>[] => {
  const lowerQuery = query.toLowerCase();
  const filtered = demoProjects.filter(project => 
    project.name?.toLowerCase().includes(lowerQuery) ||
    project.description?.toLowerCase().includes(lowerQuery) ||
    project.client?.name?.toLowerCase().includes(lowerQuery) ||
    project.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
  
  const sorted = filtered.sort((a, b) => 
    (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
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
  const sorted = demoNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return limit ? sorted.slice(0, limit) : sorted;
};

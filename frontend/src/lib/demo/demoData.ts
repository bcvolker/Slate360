import { IProject } from '../../models/Project';

// Demo project data
export const demoProjects: IProject[] = [
  {
    _id: 'demo_proj_001',
    name: 'Modern Office Complex',
    description: 'A state-of-the-art office building featuring sustainable design, smart building technology, and collaborative workspaces.',
    status: 'in_progress',
    type: 'commercial',
    location: {
      address: '123 Innovation Drive',
      city: 'Tech City',
      state: 'CA',
      zipCode: '90210',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    client: {
      name: 'TechCorp Industries',
      company: 'TechCorp Inc.',
      email: 'projects@techcorp.com',
      phone: '+1-555-0123'
    },
    timeline: {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      milestones: [
        { name: 'Design Approval', date: new Date('2024-02-15'), completed: true },
        { name: 'Foundation Complete', date: new Date('2024-04-30'), completed: true },
        { name: 'Structural Framework', date: new Date('2024-07-15'), completed: false },
        { name: 'Interior Finishing', date: new Date('2024-10-31'), completed: false },
        { name: 'Final Inspection', date: new Date('2024-12-15'), completed: false }
      ]
    },
    budget: {
      total: 2500000,
      spent: 850000,
      currency: 'USD',
      breakdown: {
        materials: 1200000,
        labor: 800000,
        equipment: 300000,
        permits: 50000,
        contingency: 150000
      }
    },
    team: [
      { name: 'Sarah Johnson', role: 'Project Manager', email: 'sarah.j@demo.com' },
      { name: 'Mike Chen', role: 'Lead Architect', email: 'mike.c@demo.com' },
      { name: 'Lisa Rodriguez', role: 'Structural Engineer', email: 'lisa.r@demo.com' },
      { name: 'David Kim', role: 'Site Supervisor', email: 'david.k@demo.com' }
    ],
    tags: ['commercial', 'sustainable', 'smart-building', 'office'],
    priority: 'high',
    riskLevel: 'medium',
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-15')
  },
  {
    _id: 'demo_proj_002',
    name: 'Residential Community',
    description: 'A mixed-use residential development featuring luxury apartments, townhouses, and community amenities.',
    status: 'planning',
    type: 'residential',
    location: {
      address: '456 Green Meadows Lane',
      city: 'Suburbia',
      state: 'NY',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    client: {
      name: 'Urban Living Group',
      company: 'Urban Living Development',
      email: 'info@urbanliving.com',
      phone: '+1-555-0456'
    },
    timeline: {
      startDate: new Date('2024-08-01'),
      endDate: new Date('2026-06-30'),
      milestones: [
        { name: 'Zoning Approval', date: new Date('2024-09-15'), completed: false },
        { name: 'Design Development', date: new Date('2024-11-30'), completed: false },
        { name: 'Construction Start', date: new Date('2025-03-01'), completed: false },
        { name: 'Phase 1 Complete', date: new Date('2025-12-31'), completed: false },
        { name: 'Final Delivery', date: new Date('2026-06-30'), completed: false }
      ]
    },
    budget: {
      total: 4500000,
      spent: 150000,
      currency: 'USD',
      breakdown: {
        materials: 2200000,
        labor: 1500000,
        equipment: 400000,
        permits: 200000,
        contingency: 200000
      }
    },
    team: [
      { name: 'Alex Thompson', role: 'Development Manager', email: 'alex.t@demo.com' },
      { name: 'Emma Wilson', role: 'Lead Designer', email: 'emma.w@demo.com' },
      { name: 'James Brown', role: 'Civil Engineer', email: 'james.b@demo.com' }
    ],
    tags: ['residential', 'mixed-use', 'luxury', 'community'],
    priority: 'medium',
    riskLevel: 'low',
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-06-10')
  },
  {
    _id: 'demo_proj_003',
    name: 'Hospital Renovation',
    description: 'Comprehensive renovation of the emergency department and patient care facilities.',
    status: 'completed',
    type: 'healthcare',
    location: {
      address: '789 Medical Center Blvd',
      city: 'Healthville',
      state: 'TX',
      zipCode: '75001',
      coordinates: { lat: 32.7767, lng: -96.7970 }
    },
    client: {
      name: 'City General Hospital',
      company: 'City General Healthcare System',
      email: 'facilities@citygeneral.org',
      phone: '+1-555-0789'
    },
    timeline: {
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      milestones: [
        { name: 'Planning Phase', date: new Date('2023-07-15'), completed: true },
        { name: 'Construction Start', date: new Date('2023-09-01'), completed: true },
        { name: 'Phase 1 Complete', date: new Date('2024-01-31'), completed: true },
        { name: 'Final Inspection', date: new Date('2024-05-15'), completed: true },
        { name: 'Project Closeout', date: new Date('2024-05-31'), completed: true }
      ]
    },
    budget: {
      total: 1800000,
      spent: 1750000,
      currency: 'USD',
      breakdown: {
        materials: 900000,
        labor: 600000,
        equipment: 200000,
        permits: 50000,
        contingency: 50000
      }
    },
    team: [
      { name: 'Dr. Maria Garcia', role: 'Medical Director', email: 'maria.g@demo.com' },
      { name: 'Robert Lee', role: 'Facilities Manager', email: 'robert.l@demo.com' },
      { name: 'Jennifer White', role: 'Project Coordinator', email: 'jennifer.w@demo.com' }
    ],
    tags: ['healthcare', 'renovation', 'emergency', 'patient-care'],
    priority: 'high',
    riskLevel: 'high',
    createdBy: 'demo_user_001',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-06-01')
  },
  {
    _id: 'demo_proj_004',
    name: 'Solar Farm Installation',
    description: 'Large-scale solar energy farm with battery storage and grid integration.',
    status: 'in_progress',
    type: 'energy',
    location: {
      address: 'Solar Valley Ranch',
      city: 'Desert Springs',
      state: 'AZ',
      zipCode: '85001',
      coordinates: { lat: 33.4484, lng: -112.0740 }
    },
    client: {
      name: 'Green Energy Solutions',
      company: 'Green Energy Corp',
      email: 'projects@greenenergy.com',
      phone: '+1-555-0321'
    },
    timeline: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-11-30'),
      milestones: [
        { name: 'Site Preparation', date: new Date('2024-03-15'), completed: true },
        { name: 'Panel Installation', date: new Date('2024-06-30'), completed: false },
        { name: 'Electrical Systems', date: new Date('2024-08-31'), completed: false },
        { name: 'Testing & Commissioning', date: new Date('2024-10-31'), completed: false },
        { name: 'Grid Connection', date: new Date('2024-11-30'), completed: false }
      ]
    },
    budget: {
      total: 3200000,
      spent: 1200000,
      currency: 'USD',
      breakdown: {
        materials: 1800000,
        labor: 800000,
        equipment: 400000,
        permits: 100000,
        contingency: 100000
      }
    },
    team: [
      { name: 'Dr. Sarah Chen', role: 'Energy Engineer', email: 'sarah.c@demo.com' },
      { name: 'Tom Martinez', role: 'Site Manager', email: 'tom.m@demo.com' },
      { name: 'Rachel Green', role: 'Electrical Engineer', email: 'rachel.g@demo.com' }
    ],
    tags: ['energy', 'solar', 'renewable', 'sustainability'],
    priority: 'high',
    riskLevel: 'medium',
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-06-12')
  },
  {
    _id: 'demo_proj_005',
    name: 'Bridge Rehabilitation',
    description: 'Structural rehabilitation and seismic retrofit of the historic downtown bridge.',
    status: 'planning',
    type: 'infrastructure',
    location: {
      address: 'Historic Bridge Crossing',
      city: 'Riverside',
      state: 'CA',
      zipCode: '92501',
      coordinates: { lat: 33.9533, lng: -117.3962 }
    },
    client: {
      name: 'City of Riverside',
      company: 'Riverside Public Works',
      email: 'engineering@riverside.gov',
      phone: '+1-555-0654'
    },
    timeline: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2026-12-31'),
      milestones: [
        { name: 'Engineering Design', date: new Date('2025-03-31'), completed: false },
        { name: 'Environmental Review', date: new Date('2025-06-30'), completed: false },
        { name: 'Construction Start', date: new Date('2025-09-01'), completed: false },
        { name: 'Phase 1 Complete', date: new Date('2026-06-30'), completed: false },
        { name: 'Final Inspection', date: new Date('2026-12-31'), completed: false }
      ]
    },
    budget: {
      total: 8500000,
      spent: 250000,
      currency: 'USD',
      breakdown: {
        materials: 4000000,
        labor: 3000000,
        equipment: 800000,
        permits: 400000,
        contingency: 300000
      }
    },
    team: [
      { name: 'Dr. Michael Chang', role: 'Structural Engineer', email: 'michael.c@demo.com' },
      { name: 'Patricia Davis', role: 'Project Manager', email: 'patricia.d@demo.com' },
      { name: 'Kevin O\'Connor', role: 'Construction Manager', email: 'kevin.o@demo.com' }
    ],
    tags: ['infrastructure', 'bridge', 'rehabilitation', 'seismic'],
    priority: 'medium',
    riskLevel: 'high',
    createdBy: 'demo_user_001',
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
export const getDemoProject = (id: string): IProject | undefined => {
  return demoProjects.find(project => project._id === id);
};

// Get demo projects by status
export const getDemoProjectsByStatus = (status: string): IProject[] => {
  return demoProjects.filter(project => project.status === status);
};

// Get demo projects by type
export const getDemoProjectsByType = (type: string): IProject[] => {
  return demoProjects.filter(project => project.type === type);
};

// Search demo projects
export const searchDemoProjects = (query: string): IProject[] => {
  const lowerQuery = query.toLowerCase();
  return demoProjects.filter(project => 
    project.name.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery) ||
    project.client.name.toLowerCase().includes(lowerQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
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

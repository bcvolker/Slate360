import { UnifiedProject } from '@/types/project';

export const mockProjects: UnifiedProject[] = [
  {
    _id: '1',
    name: 'Downtown Tower Renovation',
    description: 'Energy-efficient retrofit of a skyscraper.',
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
    team: [],
    tags: ['commercial', 'sustainable', 'retrofit'],
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-15')
  },
  {
    _id: '2',
    name: 'Community Center',
    description: 'New suburban multi-purpose hub.',
    type: 'residential',
    status: 'completed',
    location: {
      address: '456 Community St',
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
      startDate: new Date('2023-08-01'),
      endDate: new Date('2024-05-31'),
      estimatedDuration: 300
    },
    budget: {
      estimated: 4500000,
      actual: 4200000,
      currency: 'USD'
    },
    team: [],
    tags: ['residential', 'community', 'multi-purpose'],
    createdBy: 'demo_user_001',
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2024-06-01')
  },
  {
    _id: '3',
    name: 'Residential Complex',
    description: 'Modern apartment building with sustainable design.',
    type: 'residential',
    status: 'on-hold',
    location: {
      address: '789 Green Meadows',
      city: 'Eco City',
      state: 'CA',
      zipCode: '90211',
      country: 'USA',
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    client: {
      name: 'Green Living Corp',
      email: 'projects@greenliving.com',
      phone: '+1-555-0789',
      company: 'Green Living Corp'
    },
    timeline: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-02-28'),
      estimatedDuration: 365
    },
    budget: {
      estimated: 18000000,
      actual: 2000000,
      currency: 'USD'
    },
    team: [],
    tags: ['residential', 'sustainable', 'modern'],
    createdBy: 'demo_user_001',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-06-10')
  }
];
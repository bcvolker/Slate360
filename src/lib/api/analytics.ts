const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface AnalyticsData {
  projectId: string;
  views: number;
  downloads: number;
  shares: number;
  lastAccessed: string;
  popularContent: Array<{
    id: string;
    name: string;
    views: number;
  }>;
}

export const getAnalytics = async (projectId?: string): Promise<AnalyticsData[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 600));
    return [
      {
        projectId: '1',
        views: 1250,
        downloads: 89,
        shares: 23,
        lastAccessed: '2024-01-15T08:30:00Z',
        popularContent: [
          { id: '1', name: 'Main Building Model', views: 450 },
          { id: '2', name: 'Site Photos', views: 320 },
          { id: '3', name: 'Project Specifications', views: 280 },
        ],
      },
      {
        projectId: '2',
        views: 890,
        downloads: 45,
        shares: 12,
        lastAccessed: '2024-01-14T16:20:00Z',
        popularContent: [
          { id: '4', name: 'Community Center Model', views: 380 },
          { id: '5', name: 'Floor Plans', views: 250 },
        ],
      },
    ];
  }
  throw new Error('Analytics API not implemented yet.');
};

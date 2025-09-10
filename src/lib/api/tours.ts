const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface Tour {
  id: string;
  name: string;
  projectId: string;
  tourUrl: string;
  thumbnailUrl: string;
  duration: number;
  createdAt: string;
}

export const getTours = async (projectId?: string): Promise<Tour[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 400));
    return [
      {
        id: '1',
        name: 'Main Lobby Tour',
        projectId: '1',
        tourUrl: '/mock/tour-lobby.html',
        thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        duration: 180,
        createdAt: '2024-01-10T09:00:00Z',
      },
      {
        id: '2',
        name: 'Office Floor Walkthrough',
        projectId: '1',
        tourUrl: '/mock/tour-office.html',
        thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
        duration: 240,
        createdAt: '2024-01-12T14:30:00Z',
      },
    ];
  }
  throw new Error('Tours API not implemented yet.');
};

export const createTour = async (projectId: string, tourData: Omit<Tour, 'id' | 'projectId' | 'createdAt'>): Promise<Tour> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      id: Date.now().toString(),
      projectId,
      createdAt: new Date().toISOString(),
      ...tourData,
    };
  }
  throw new Error('Tours API not implemented yet.');
};
